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

Flame.prototype.Cd = 0.47; //coefficient of drag
Flame.prototype.rho = 1.22; //density of what the ball is in, in this case air
Flame.prototype.ag = 1; //grav
Flame.prototype.mass = 0.1; //mass of the ball

Flame.prototype.lifeSpan = 300 / NOMINAL_UPDATE_INTERVAL;

Flame.prototype.update = function (du) {

    this.pickSprite();

    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    this.lifeSpan -= du;

    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;
    
    this.applyGravity(du);

    this.rotation += 1 * du;
    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);

    //this.wrapPosition();
};

Flame.prototype.applyGravity = function (du) {

    //Kemur magic number úr this.getRadius() í bili, sjá getRadius()
    var A = Math.PI*this.getRadius()*this.getRadius()/1000;

    // Drag force: Fd = -1/2 * Cd * A * rho * v * v
    var Fx = -0.5 * this.Cd * A * this.rho * this.velX * this.velX * this.velX / Math.abs(this.velX);
    var Fy = -0.5 * this.Cd * A * this.rho * this.velY * this.velY * this.velY / Math.abs(this.velY);
            
    Fx = (isNaN(Fx) ? 0 : Fx);
    Fy = (isNaN(Fy) ? 0 : Fy);
            
    // Calculate acceleration ( F = ma )
    var ax = Fx / this.mass;
    var ay = this.ag + (Fy / this.mass);

    //console.log(ax);
    //console.log(ay);

    console.log(Fy);

    // Integrate to get velocity
    this.velX += ax*du;
    this.velY += ay*du;

    //console.log('velx: ' + this.velX);
    //console.log('vely: ' + this.velY);
            
    // Integrate to get position
    this.cx += this.velX*du;
    this.cy += this.velY*du;
    
};


var NOMINAL_GRAVITY = 1;

Flame.prototype.computeGravity = function(du) {
    return g_useGravity ? NOMINAL_GRAVITY : 0;
}

Flame.prototype.getRadius = function () {
    console.log((this.activeSprite.width/2)*0.9);
    //return (this.activeSprite.width / 2) * 0.9;       <----------
    //Þetta skilar stundum einhverju rugli yfir í
    //Fx og Fy í gegnum A
    return 2;
};

Flame.prototype.pickSprite = function() {

    var sprite_base = this.sprite;

    if (this._animFrame>=9) {
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
