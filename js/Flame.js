// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Flame(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this._animFrame = 0;
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.fireball;
    this.activeSprite = this.activeSprite || g_sprites.fireball.rotating[0];
}

Flame.prototype = new Entity();

// Initial, inheritable, default values
Flame.prototype.rotation = 0;
Flame.prototype.cx = 200;
Flame.prototype.cy = 200;
Flame.prototype.velX = 1;
Flame.prototype.velY = 1;

Flame.prototype.lifeSpan = 600 / NOMINAL_UPDATE_INTERVAL;

Flame.prototype.update = function (du) {

    spatialManager.unregister(this);

    this.pickSprite();

    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    this.lifeSpan -= du;

    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;

    /*
    þetta er allt saman í vinnslu
    var accelY=2;
    accelY += this.computeGravity();
    
    var finalv = this.velY + accelY*du;
    this.velY = (this.velY + finalv)/2;
    */

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    this.rotation += 1 * du;
    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);

    //this.wrapPosition();

    spatialManager.register(this);
};

var NOMINAL_GRAVITY = 1;

Flame.prototype.computeGravity = function(du) {
    return g_useGravity ? NOMINAL_GRAVITY : 0;
}

Flame.prototype.getRadius = function () {
    return 4;
};

Flame.prototype.pickSprite = function() {

    var sprite_base = this.sprite;

    if (this._animFrame>8) {
        this._animFrame = 0;
    }

    this._animFrame +=1;

    this.activeSprite = sprite_base.rotating[this._animFrame];
}


Flame.prototype.render = function (ctx) {

    var fadeThresh = Flame.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;
    this.activeSprite.drawCentredAt(ctx, this.cx, this.cy,this.rotation);

    ctx.globalAlpha = 1;
};
