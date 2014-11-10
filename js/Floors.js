// ===============
// Platform STUFF
// ===============
"use strict";
/* jshint browser: true, devel: true, globalstrict: true */
// A generic contructor which accepts an arbitrary descriptor object


function Platform(descr) {
	this.setup(descr);
    this.sprite = g_sprites.testplat;
    this.platHeight = this.sprite.height;
    this.platWidth = this.sprite.width;
    this.halfWidth = this.platHeight/2;
    this.halfHeight = this.platWidth/2;
};

Platform.prototype = new Entity();
Platform.prototype.cx = 50;
Platform.prototype.cy = 550;
Platform.prototype.padding = 0;
Platform.prototype.verticalSpeed = 5.25;



Platform.prototype.getBaseWidth = function(){
    return this.platWidth;
}

Platform.prototype.render = function (ctx) {
	//ctx.fillStyle="#0000FF";
    console.log(this.halfWidth);
	this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
};


Platform.prototype.update = function (du) {

	spatialManager.unregister(this);

	if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    this.gameHeight = g_canvas.height - this.cy + this.platHeight/2 + g_GAME_HEIGHT;

    if (this.cy>600) {
    	this.kill();
    }
    
    this.cy +=this.verticalSpeed*du;

    spatialManager.register(this);    

};

Platform.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.halt();
};


