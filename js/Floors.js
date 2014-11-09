// ===============
// Platform STUFF
// ===============
"use strict";
/* jshint browser: true, devel: true, globalstrict: true */
// A generic contructor which accepts an arbitrary descriptor object


function Platform(descr) {

	for (var property in descr) {
        this[property] = descr[property];
    }
};

var g_platform = new Platform({
    cx : 150,
    cy : 150,
    platWidth : 50,
    platHeight : 10
});

Platform.prototype = new Entity();

Platform.prototype.render = function (ctx) {
	//Placeholder 
	ctx.fillStyle="#FF0000";
	ctx.fillRect(g_platform.cx, g_platform.cy, g_platform.platWidth, g_platform.platHeight);
};

Platform.prototype.collides = function(){

}; 

Platform.prototype.update = function (du) {    

};

Platform.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.halt();
};


