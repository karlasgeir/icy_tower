
// ========================
// CLOCK AND SPEED INCREASE
// ========================

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

function Clock(descr) {

	this.sprite = g_sprites.clock;
    this.clockHeight = this.sprite.height;
    this.clockWidth = this.sprite.width/2;
    this.scale  = this.scale  || 1;
    this.timer = 1/NOMINAL_UPDATE_INTERVAL;
    this.indicatorRotation = 0;
    this.clockRotation = 0;
    this.speed = 30;
    this.topDist = 10;

    this.cx = this.clockWidth;
    this.cy = this.topDist + this.clockHeight/2;
    this.rotateClock = false;
};

Clock.prototype = new Entity();

Clock.prototype.alarmClock = new Audio("res/sounds/alarmClock.wav");

Clock.prototype.render = function (ctx) {

	this.sprite.drawCentredAt(ctx, this.cx, this.cy, this.clockRotation);
	g_sprites.indicator.drawCentredAt(ctx, this.cx, this.cy, this.indicatorRotation);
};

Clock.prototype.update = function (du) {
	
	//18
	// ===============
	// INDICATOR STUFF
	// ===============
	if (g_GAME_HEIGHT === 0) { return;}

	var tickRate = this.timer/18;
	this.indicatorRotation +=tickRate*du;

	var circle = 2*Math.PI;
	var speedInfluence = 0.5;
	var jumpInfluence = 0.5;

	if (this.indicatorRotation>=circle) {
		if (!gameOver) {
			this.alarmClock.play();
		}
		this.rotateClock = true;
        entityManager.generateNotification("HURRYUP",2);
		this.indicatorRotation = 0;
		if (g_VERTICAL_SPEED>2.5) {return;}
		g_VERTICAL_SPEED +=speedInfluence;
		Character.prototype.NOMINALS.THRUST += jumpInfluence;
	}

	// =============
	// CLOCK STUFF
	// =============

	var dX = +Math.sin(this.clockRotation);
    var dY = -Math.cos(this.clockRotation);
    var launchDist = this.clockWidth;

    //Calculate the x and y velocities
    var relVel = this.speed;
    var relVelX = dX * relVel;
    var relVelY = dY * relVel;

    var randomFactor = util.randRange(-3,3);

    var flameVelX = randomFactor*(relVelX); 
    var flameVelY = randomFactor*(relVelY);
    var flameGrav = 0.1;

	if (this.rotateClock) {

		this.clockRotation +=0.5;

	    if (this.clockRotation<=4*circle) {

	    	this.cx += util.randRange(-1,1);
	    	this.cy += util.randRange(-1,1);

	    	this.sprite.drawCentredAt(ctx, this.cx, this.cy, this.clockRotation);
	    	entityManager.generateFlame(
		    this.cx + dX*launchDist, 
		    this.cy + dY*launchDist,
		    flameVelX, 
		    flameVelY,
		    flameGrav,
		    this.clockRotation);
	    } else {
	    	this.cx = this.clockWidth;
	    	this.cy = this.topDist + this.clockHeight/2;
	    	this.rotateClock = false;
			this.clockRotation = 0;
			this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
	    } 
	} 
};
