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
Platform.prototype.platHeight = 10;
Platform.prototype.platWidth = 150;


Platform.prototype.render = function (ctx) {

	ctx.fillStyle="#FF0000";
	ctx.fillRect(this.cx, this.cy, this.platWidth, this.platHeight);
};

Platform.prototype.collides = function() {

}; 

Platform.prototype.update = function (du) {    

};

Platform.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.halt();
};


