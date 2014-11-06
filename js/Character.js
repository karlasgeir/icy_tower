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
    this._goingLeft = false;
    this._goingRight = false;
    this._running = false;
    this._left = false;
    this._wall = false;
    this._animFrame = 0;
    this.jumpHeight = 0;
    this._animTicker = 0;
    this.rotationJump = false;
    
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
Character.prototype.speed = 0;

// HACKED-IN AUDIO (no preloading)
/*Include audio:
Played with this.jumsound.play()
Character.prototype.jumpSound = new Audio(
    "sounds/something");
*/


    
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

        //Check whether there should be rotation
        if(this._rotationJump && this._jumping){
            this.computeRotation(du);
        }
        else this.rotation = 0;


        // TODO: Handle collisions
        if(this.isColliding() && this.isColliding().getSpatialID() !== this.getSpatialID()){
        }
        else{
            spatialManager.register(this);
        }
    }
};


// Function that rotates the character
var NOMINAL_ROTATION_RATE = 30;
Character.prototype.computeRotation = function(du){
    if (this.velX>0){
    this.rotation += du*(Math.PI/NOMINAL_ROTATION_RATE);}
    else {this.rotation += du*-(Math.PI/NOMINAL_ROTATION_RATE);}
}

Character.prototype.computeSubStep = function (du) {

    this.wallBounce(this.velX, this.velY);
    this.sharpTurns();

    if (this.velY === 0) {
        this._jumping = false;
        this._rotationJump = false;
    }

    this.speed = this.computeSpeed();

    var accelX = this.speed;

    this.applyAccelX(accelX, du);

    var accelY = -this.computeThrustMag();
    accelY += this.computeGravity();
    this.velY = this.velY + (accelY*du)/2;

    this.cy += this.velY*du;

    var nextX = this.cx + this.velX*du;
    var nextY = this.cy + this.velY*du;


    if(this._animTicker < Math.abs(20-Math.abs(this.velX))){
        this._animTicker +=1*du;
    }else{
        this.chooseSprite(this.velX,this.velY,nextX,nextY);
        this._animTicker = 0;
    }

    this.wrapPosition();
};

var NOMINAL_SPEED = 0.5;
var NOMINAL_SLOW = 0.45;
var MAX_SPEED = 12;

Character.prototype.computeSpeed = function(){

    if (this._jumping) {
        MAX_SPEED = 16;
    }

    if (!keys[this.KEY_RIGHT] && !keys[this.KEY_LEFT]) {
        if (this.velX===0) {return;}
        if (this.velX<0) {
            if(this.velX + NOMINAL_SLOW >0) this.velX=0;
            else this.velX += NOMINAL_SLOW;
        }
        if (this.velX>0) {
            if(this.velX + NOMINAL_SLOW <0) this.velX=0;
            else this.velX -= NOMINAL_SLOW;
        }

    }
    if(keys[this.KEY_RIGHT]) {

        this._goingRight = true;
        this._goingLeft =  false;

        if(this.velX + NOMINAL_SPEED > MAX_SPEED) {
            this.velX = MAX_SPEED;
        }
        else {
            this.velX += NOMINAL_SPEED;
        }
    }
    else if(keys[this.KEY_LEFT]) {

        this._goingRight = false;
        this._goingLeft =  true;

        if(this.velX - NOMINAL_SPEED < -MAX_SPEED) {
            this.velX = -MAX_SPEED;
        }
        else {
            this.velX -= NOMINAL_SPEED;
        }
    } 
    else return 0;
}

Character.prototype.sharpTurns = function () {

    if (this._jumping) {return;}
    if (this.cx+this.activeSprite.width/2 >= g_canvas.width) {return;}
    if (this.cx-this.activeSprite.width/2 <= 0) {return;}

    if (this._goingRight && keys[this.KEY_LEFT]) {
        this.velX = 0;
    }
    if (this._goingLeft && keys[this.KEY_RIGHT]) {
        this.velX = 0;
    }
}

Character.prototype.applyAccelX = function(accelX, du){

    var initial_velX = this.velX;
    var average_velX = 0;
    var final_velX = 0;

    average_velX = ((initial_velX + final_velX)/2)*du;

    final_velX = initial_velX + accelX*du;

    this.cx += average_velX*du;

}

var NOMINAL_GRAVITY = 1;

Character.prototype.computeGravity = function () {

    if(this.cy+this.activeSprite.height/2 < g_canvas.height && this._jumping){
        return g_useGravity ? NOMINAL_GRAVITY : 0;
    }
    else{
        this.velY = 0;
    }
    return 0;
};

var NOMINAL_THRUST = 20;

Character.prototype.computeThrustMag = function () {

    var speedInfluence = 0.1*Math.abs(this.velX);

    //Needs more work
    if ((keys[this.KEY_JUMP] && !this._jumping) ) {
        this._jumping = true;
        var speed = Math.abs(this.velX);

        if (speed===0 || speed <8) {
            return this.velY = NOMINAL_THRUST;
        }
        else return this.velY = NOMINAL_THRUST*speedInfluence;
    }
    return 0;
};

Character.prototype.checkForPlatform = function () {
    //TODO: implement this
}

Character.prototype.wallBounce = function (velX, velY) {
    //TODO: implement this
    this.checkForRotation(velX, velY);
    
    if(this.cx+this.activeSprite.width/2 >= g_canvas.width ||
        (this.cx-this.activeSprite.width/2 <= 0)) { 

        this._goingRight = !this._goingRight;
        this._goingLeft = !this._goingLeft;
        
        if (this._rotationJump) {
            return this.velX *=-1.5, this.velY *= 1.05;
        } else {
            return this.velX *=-1;

        }

    }
}

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

Character.prototype.checkForRotation = function(velX,velY) {
    if((Math.abs(velX) > ROTATION_JUMP_THRESHOLD) && this._jumping) {
        this._rotationJump = true;
    }
    else {
        this._rotationJump = false;
    }
}

var ROTATION_JUMP_THRESHOLD = 8;
Character.prototype.chooseSprite = function (velX,velY,nextX,nextY){
    var prevLeft = this._left;
    var prevJumping = this._jumping;
    var prevWall = this._wall;
    var incrAnimFrame = false;
    var sprite_base = this.sprite;
    var transition = false;

    this.checkForRotation(velX,velY);

    //Check if in transition
    if(prevLeft && velX > 0 || prevJumping && velY === 0 || !prevLeft && velX < 0){
        transition = true;
        this._animFrame = 0;
    }
    //If there's speed in y direction we are jumping
    if(velY !== 0) this._jumping = true;
    else this._jumping = false;
    
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
        if(this._rotationJump){
            this.activeSprite = this.sprite.rotate;
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