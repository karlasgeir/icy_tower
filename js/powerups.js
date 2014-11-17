// ======
// POWERUPS
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Power(descr) {


    this.sprite = g_sprites.power;
    this.powerWidth = this.sprite.height;
    this.powerHeight = this.sprite.width;
    // Common inherited setup logic from Entity
    this.setup(descr);
}

Power.prototype = new Entity();

// Initial, inheritable, default values
Power.prototype.cx = 0;
Power.prototype.cy = 0;
Power.prototype.width=0;
Power.prototype.height=0;

Power.prototype.update = function (du) {
    /*
    spatialManager.unregister(this);
    
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    this.gameHeight = g_canvas.height - this.cy + this.powerHeight/2 + g_GAME_HEIGHT;

    //this.wrapPosition();

    //If game is over
    if(!gameOver){
         spatialManager.register(this);
    }
    */
};

Power.prototype.render = function (ctx) {

    //this.sprite.drawWrappedCentredAt(ctx, this.cx, this.cy, 0);
    /*
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;
    this.activeSprite.drawCentredAt(ctx, this.cx, this.cy,this.rotation);
    */
};