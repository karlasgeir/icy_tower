// ===============
// CHARACTER STUFF
// ===============
"use strict";
/* jshint browser: true, devel: true, globalstrict: true */
// A generic contructor which accepts an arbitrary descriptor object
function Character(descr) {

    // Common inherited setup logic from Entity
    this._scale = 1;

    this.setup(descr);

    this.rememberResets();
    this._jumping = false;
    this._left = false;
    this._wall = false;
    this._animFrame = 0;
    this.jumpHeight = 0;
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.character;
    this.activeSprite = this.activeSprite || g_sprites.character.idle[0];

    // Set normal drawing scale, and warp state off
        this._isWarping = false;
};

Character.prototype = new Entity();

Character.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
};

Character.prototype.KEY_UP = 'W'.charCodeAt(0);
Character.prototype.KEY_DOWN  = 'S'.charCodeAt(0);
Character.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Character.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

Character.prototype.KEY_JUMP   = 32;

// Initial, inheritable, default values
Character.prototype.rotation = 0;
Character.prototype.cx = 200;
Character.prototype.cy = 200;
Character.prototype.velX = 0;
Character.prototype.velY = 0;
Character.prototype.numSubSteps = 1;

// HACKED-IN AUDIO (no preloading)
/*Include audio:
Played with this.jumsound.play()
Character.prototype.jumpSound = new Audio(
    "sounds/something");
*/

Character.prototype.jumpRight = function () {

    //this.jumpSound.play();
    //Implement jumping right
};

Character.prototype.jumpLeft = function(){
    //this.jumpSound.play()
    //Implement jumping left
}


    
Character.prototype.update = function (du) {    
    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);
    if(this._isDeadNow){return entityManager.KILL_ME_NOW;}
    else{
        // Perform movement substeps
        var steps = this.numSubSteps;
        var dStep = du / steps;
        for (var i = 0; i < steps; ++i) {
            this.computeSubStep(dStep);
        }


        // TODO: Handle collisions
        if(this.isColliding() && this.isColliding().getSpatialID() !== this.getSpatialID()){
            this.warp();
        }
        else{
            spatialManager.register(this);
        }
    }
};

Character.prototype.computeSubStep = function (du) {
    this.velX = this.computeAccelX()*du;
    var accelY = -this.computeThrustMag();
        accelY += this.computeGravity();
    //avVel = (2v + at)/2 = v + at/2
    this.velY = this.velY + (accelY*du)/2;
    
    var nextX = this.cx + this.velX;
    var nextY = this.cy + this.velY;
    if(g_isUpdateOdd){
        this.chooseSprite(this.velX,this.velY,nextX,nextY);
    }
    this.cx += this.velX;
    this.cy += this.velY;

    
    this.wrapPosition();
};

var NOMINAL_Accel = 3;
Character.prototype.computeAccelX = function(){
    if(keys[this.KEY_RIGHT]) return NOMINAL_Accel;
    else if(keys[this.KEY_LEFT]) return -NOMINAL_Accel;
    else return 0;
}


var NOMINAL_GRAVITY = 0.12;

Character.prototype.computeGravity = function () {
    if(this.cy+this.activeSprite.height/2 < g_canvas.height){
        return g_useGravity ? NOMINAL_GRAVITY : 0;
    }
    this.velY = 0;
    return 0;
};

var NOMINAL_THRUST = 10;

Character.prototype.computeThrustMag = function () {
        
    if ((eatKey(this.KEY_UP) || eatKey(32))&& !this._jumping ) {
        return NOMINAL_THRUST;
    }
    
    return 0;
};


Character.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};


Character.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    
    this.halt();
};

Character.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

Character.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;
    this.activeSprite.drawCentredAt(ctx, this.cx, this.cy,this.rotation);
    this.sprite.scale = origScale;
};



Character.prototype.chooseSprite = function (velX,velY,nextX,nextY){
    var prevLeft = this._left;
    var prevJumping = this._jumping;
    var prevWall = this._wall;
    var incrAnimFrame = false;
    var sprite_base = this.sprite;
    var transition = false;

    //Check if in transition
    if(prevLeft && velX > 0 || prevJumping && velY === 0 || !prevLeft && velX < 0){
        transition = true;
        this._animFrame = 0;
    }
    //If there's speed in y direction we are jumping
    if(velY !== 0) this._jumping = true;
    else this._jumping = false;
    console.log(velY)
    
    //If there's negative speed in the x direction we are going to the left
    if(velX < 0){
        this._left = true;
        //Use left sprite
        sprite_base = this.sprite.rev;
    }
    else this._left = false
    
    //Check if it is crashing with the wall
    if(nextX < this.activeSprite.width/2 || nextX > g_canvas.width - this.activeSprite.width/2){
        this._wall = true;
        if(!prevWall){
            this._animFrame = 0;
        }
    }
    else this._wall = false;

    //If jumping
    if(this._jumping){
        //If we are not moving in x direction we jump straight up
        if(velX === 0){
            this.activeSprite = this.sprite.jump[3];
        }
        else if(this._wall){
            this.activeSprite = sprite_base.edge[this._animFrame];
            if(this._animFrame === 0){
                this._animFrame +=1;
            }
        }
        else{
            this.activeSprite = sprite_base.jump[this._animFrame];
            if(this._animFrame === 0){
                this._animFrame = 1;
            }
            //TODO: check if it's landing
            else if(this._animFrame === 1){
                this._animFrame = 2;
                prevJumping = true;
            }
        }
    }
    else{
        if(velX == 0){
            this.activeSprite = this.sprite.idle[0];
        }
        else{
            this.activeSprite = sprite_base.walk[this._animFrame];
            if(this._animFrame === 3){
                this._animFrame -=1;
            }
            else{
                this._animFrame += 1;
            }
        }

    }

    
}