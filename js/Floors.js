// ===============
// Platform STUFF
// ===============
"use strict";
/* jshint browser: true, devel: true, globalstrict: true */
// A generic contructor which accepts an arbitrary descriptor object


function Platform(descr) {
	this.setup(descr);
};

Platform.prototype = new Entity();

Platform.prototype.cx = 50;
Platform.prototype.cy = 550;
Platform.prototype.padding = 0;
Platform.prototype.platHeight = 10;
Platform.prototype.platWidth = 150;
Platform.prototype.verticalSpeed = 0.25;


Platform.prototype.render = function (ctx) {

	ctx.fillStyle="#0000FF";
	ctx.fillRect(this.cx, this.cy, this.platWidth, this.platHeight);;
};

Platform.prototype.collidesWith = function(prevX, prevY, 
                                          nextX, nextY) {
};

Platform.prototype.update = function (du) {

	spatialManager.unregister(this);

	if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    if (this.cy>600) {
    	this.kill();
    }
    
    //this.cy +=this.verticalSpeed*du;

    spatialManager.register(this);    

};

Platform.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.halt();
};


