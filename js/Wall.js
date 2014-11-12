// ===============
// wall STUFF
// ===============
"use strict";
/* jshint browser: true, devel: true, globalstrict: true */
// A generic contructor which accepts an arbitrary descriptor object


 
function Wall(descr) {
    this.setup(descr);
    this.sprite = g_sprites.wallsprite;
    this.wallHeight = this.sprite.height;
    this.wallWidth = this.sprite.width;
    this.halfWidth = this.wallHeight/2;
    this.halfHeight = this.wallWidth/2;
};

Wall.prototype = new Entity();
Wall.prototype.cx = 0;
Wall.prototype.cy = 0;
Wall.prototype.padding = 0;
Wall.prototype.wallHeight = 0;
Wall.prototype.wallWidth = 0;
Wall.prototype.verticalSpeed = 0.5;



Wall.prototype.getBaseWidth = function(){
    return this.wallWidth;
}


Wall.prototype.render = function (ctx) {

    var w = this.wallWidth;
    var h = this.wallHeight;
    
	//g_sprites.wallsprite.drawAt(ctx, 0, 0, 0);
    console.log(this.halfHeight);
	this.sprite.drawWrappedCentredAt(ctx, this.cx, this.cy, 0);
};


Wall.prototype.update = function (du) {


	if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    
    this.cy +=this.verticalSpeed*du;
    
    if (this.cy>g_canvas.height) {
        this.cy = 0;
    }


};

Wall.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.halt();
};


