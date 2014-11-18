
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
    this.timer = 600/NOMINAL_UPDATE_INTERVAL;
    this.rotation = 0;
    this.speed = 0;

    this.cx = this.clockWidth;
    this.cy = this.clockHeight;
}


Clock.prototype.render = function (ctx) {
	this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
	g_sprites.indicator.drawCentredAt(ctx, this.cx, this.cy, 0);
};

Clock.prototype.update = function (du) {
};
