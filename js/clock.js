
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

	if (this.rotation>circle) {
		this.rotation = 0;
	}
};
