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
Wall.prototype.cx = 10;
Wall.prototype.cy = 10;
Wall.prototype.padding = 0;
Wall.prototype.wallHeight = 10;
Wall.prototype.wallWidth = 150;
Wall.prototype.halfWidth = Wall.prototype.platWidth/2;
Wall.prototype.halfHeight = Wall.prototype.platHeight/2;



Wall.prototype.getBaseWidth = function(){
    return this.wallWidth;
}


Wall.prototype.render = function (ctx) {
	//ctx.fillStyle="#0000FF";
	
	//ctx.fillStyle="#0000FF";
    var w = this.wallWidth;
    var h = this.wallHeight
    
	g_sprites.wallsprite.drawAt(ctx, this.cx-w/2, this.cy-h/2, 0, 0);
	//ctx.fillRect(this.cx-w/2, this.cy-h/2, w, h);
    console.log(this.halfHeight);
	this.sprite.drawWrappedCentredAt(ctx, this.cx, this.cy, 0);
};


Wall.prototype.update = function (du) {

	spatialManager.unregister(this);

	if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    
    //this.gameHeight = g_canvas.height - this.cy + this.platHeight/2 + g_GAME_HEIGHT;
    this.cy +=Platform.prototype.verticalSpeed*du;
    
    spatialManager.register(this);    

};

Wall.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.halt();
};


