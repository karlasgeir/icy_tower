
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
    this.rotation = 0;
    this.speed = 0;

    this.cx = this.clockWidth;
    this.cy = this.clockHeight;
};

Clock.prototype = new Entity();

Clock.prototype.render = function (ctx) {
	this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
	g_sprites.indicator.drawCentredAt(ctx, this.cx, this.cy, this.rotation);
};

Clock.prototype.update = function (du) {
	
	var tickRate = this.timer/18;
	this.rotation +=tickRate*du;

	var circle = 2*Math.PI;
	var speedInfluence = 0.2;
	var jumpInfluence = 0.5;

	/*
	var dX = +Math.sin(this.rotation);
    var dY = -Math.cos(this.rotation);
    //Set the launch distance
    var launchDist = this.getRadius() * this.NOMINALS.FIRE_LAUNCH_MULTIPLIER;

    //Calculate the x and y velocities
    var relVel = this.flameVelocity;
    var relVelX = dX * relVel;
    var relVelY = dY * relVel;

    var randomFactor = util.randRange(-3,3);

    var flameVelX = randomFactor*(+this.velX + relVelX); 
    var flameVelY = randomFactor*(this.velY + relVelY);
	
    //Generate the flame

    if(entityManager._flame.length>g_FIREBOLTS) {return;}      
    entityManager.generateFlame(
        this.cx + dX * launchDist, 
        this.cy + dY * launchDist,
        flameVelX, 
        flameVelY,
        this.rotation);
*/

	if (this.rotation>circle) {
		if (g_VERTICAL_SPEED>1.5) {return;}
		g_VERTICAL_SPEED +=speedInfluence;
		Character.prototype.NOMINALS.THRUST += jumpInfluence;
		this.rotation = 0;
	}
};