// ===============
// wall STUFF
// ===============
"use strict";
/* jshint browser: true, devel: true, globalstrict: true */
// A generic contructor which accepts an arbitrary descriptor object
function Wall(descr) {
    this.sprite = g_sprites.wallsprite;
    this.wallHeight = this.sprite.height;
    this.wallWidth = this.sprite.width;
    
    this.setup(descr);
    
    this.halfWidth = this.wallHeight/2;
    this.halfHeight = this.wallWidth/2;
};
//Create entity
Wall.prototype = new Entity();

//Initial values that can be overwritten
Wall.prototype.cx = 0;
Wall.prototype.cy = 0;
Wall.prototype.padding = 0;
Wall.prototype.wallHeight = 0;
Wall.prototype.wallWidth = 0;
Wall.prototype.verticalSpeed =0;


/*
    This function returns the width of the wall
*/
Wall.prototype.getBaseWidth = function(){
    return this.wallWidth;
}

/*
    This function renders the wall
*/
Wall.prototype.render = function (ctx) {
	this.sprite.drawWrappedCentredAt(ctx, this.cx, this.cy, 0);
};

/*
    This function updates the wall
*/
var NOMINAL_MOVE_RATE = Platform.prototype.verticalSpeed;
var FASTER_MOVE_RATE = 8;
Wall.prototype.update = function (du) {
	if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    //If the screen is moving
    if (screenIsMoving) {
        //We want it to move faster then everything else
        //when the screen moves
        this.verticalSpeed = FASTER_MOVE_RATE;
        this.cy +=this.verticalSpeed*du;
    }
    //If the screen has moved once, but isn't moving
    //We use the nominal move rate
    if (!screenIsMoving && g_GAME_HEIGHT>0) {
        this.verticalSpeed = NOMINAL_MOVE_RATE;
        this.cy +=this.verticalSpeed*du;
    }
    //Wrap around
    if (this.cy>g_canvas.height) {
        this.cy = 0;
    }
};

/*
    this function halts the movement of the wall
*/
Wall.prototype.halt = function(){
    this.verticalSpeed = 0;
}
/*
    this function resets the wall
*/
Wall.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.halt();
};


