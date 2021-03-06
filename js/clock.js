
// ========================
// CLOCK AND SPEED INCREASE
// ========================

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */
/*
    The clock
*/
function Clock(descr) {
    //initial values
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
//Audio for the clock
Clock.prototype.alarmClock = new Audio("res/sounds/alarmClock.wav");
/*
    A function to render the clock
*/
Clock.prototype.render = function (ctx) {
    //Draw the clock
	this.sprite.drawCentredAt(ctx, this.cx, this.cy, this.clockRotation);
	//Draw the indicator
    g_sprites.indicator.drawCentredAt(ctx, this.cx, this.cy, this.indicatorRotation);
};

/*
    A function to update the clock
*/
Clock.prototype.update = function (du) {
	//We don't want it to start untill the 
    //screen has moved once
	if (g_GAME_HEIGHT === 0) { return;}

    // =============
    // INDICATOR STUFF
    // =============
    //Let the clock tick
	var tickRate = this.timer/18;
	this.indicatorRotation +=tickRate*du;
	var circle = 2*Math.PI;
	var speedInfluence = 0.5;
	var jumpInfluence = 0.75;
    //After each round on the clock
	if (this.indicatorRotation>=circle) {
		if (!gameOver) this.alarmClock.play();
		this.rotateClock = true;
        //generate the notification
        entityManager.generateNotification("HURRYUP",0.4);
		this.indicatorRotation = 0;
        //Increase the vertical speed of just about everything
		if (g_VERTICAL_SPEED>2.5) return; //Don't want it to get out of hand though
		g_VERTICAL_SPEED +=speedInfluence;
        //Increase the jump height of the character
		entityManager.increaseJumpHeight(jumpInfluence);
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
