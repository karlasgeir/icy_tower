// ===============
// CHARACTER STUFF
// ===============
"use strict";
/* jshint browser: true, devel: true, globalstrict: true */
// A generic contructor which accepts an arbitrary descriptor object
function Character(descr) {

    // Common inherited setup logic from Entity
    this._scale = 1;
    this.rememberResets();
    this._jumping = false;
    this._falling = false;
    this._goingLeft = false;
    this._goingRight = false;
    this._running = false;
    this._left = false;
    this._wall = false;
    this._animFrame = 0;
    this.jumpHeight = 0;
    this._animTicker = 0;
    this.rotationJump = false;
    this.currPlatform = false;
    this.isBouncing = false;

    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.character;
    this.activeSprite = this.activeSprite || g_sprites.character.idle[0];

};

Character.prototype = new Entity();

Character.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = g_canvas.width/2;
    this.reset_cy = g_canvas.height;
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
        
        //Update game height
        this.gameHeight = g_canvas.height - this.cy - this.activeSprite.height/2 + g_GAME_HEIGHT;
        // TODO: Handle collisions
        if(this._jumping && this.velY > 0){
            this.handleCollision();
        }
        else{
            this.checkPlatform();
        }
        if(!gameOver){
            spatialManager.register(this);
        }
};

Character.prototype.checkPlatform = function(){
    if(this.currPlatform){
        var pos = this.currPlatform.getPos();
        var size = this.currPlatform.getSize();
        var gameHeight = this.currPlatform.getGameHeight();
        if(this.cx - this.activeSprite.width/2 < pos.posX+size.width/2
            && this.cx + this.activeSprite.width/2 > pos.posX - size.width/2
            && util.isBetween(this.getGameHeight(),gameHeight-3,gameHeight+5)){
            g_useGravity = false;
            this._jumping = false;
            this.velY = 0;
        }
        else{
            this.currPlatform = false;
            g_useGravity = true;
            this._jumping = true;
        }
    }
}

Character.prototype.handleCollision = function(du){
    var isHit = this.isColliding();
    if (isHit) {
        this.cy = isHit.getPos().posY - isHit.getSize().height/2 - this.activeSprite.height/2;
        g_useGravity = false;
        this._jumping = false;
        this.velY = 0;
        this.currPlatform = isHit;
    }   
}

// Function that rotates the character
var NOMINAL_ROTATION_RATE = 30;
Character.prototype.computeRotation = function(du){
    if (this.velX>0){
    this.rotation += du*(Math.PI/NOMINAL_ROTATION_RATE);}
    else {this.rotation += du*-(Math.PI/NOMINAL_ROTATION_RATE);}
}

Character.prototype.computeSubStep = function (du) {

    this.wallBounce(this.velX, this.velY);
    //this.sharpTurns();
   // console.log(g_GAME_HEIGHT);
    var prevX = this.cx;
    var prevY = this.cy;

    var nextX = prevX + this.velX * du;
    var nextY = prevY + this.velY * du;
    
    if (
        this.velY === 0 && (g_GAME_HEIGHT === 0 || !this.currPlatform)) {
        this._jumping = false;
        this._falling = false;
        this._roationJump = false;
        this.isBouncing = false;
    }
    if (this.velY > 0) {
        this._falling = true;
    }

    if (this.currPlatform) {
        this.isBouncing = false;
    }
    /*
    console.log(this.velY);
    console.log(this._falling);
    console.log(this._jumping);
    */
    this.speed = this.computeSpeed();

    var accelX = this.speed;
    this.applyAccelX(accelX, du);

    var accelY = -this.computeThrustMag();
    accelY += this.computeGravity();
    if(this.currPlatform){
     //   console.log("VELY",this.velY);
    } 
    
    var finalv = this.velY + accelY*du;
    this.velY = (this.velY + finalv)/2;
    this.cy += this.velY*du;

    if(this.currPlatform){
         this.cy +=Platform.prototype.verticalSpeed*du;
    } 

    var NOMINAL_ANIM_FRAME_RATE = 20;
    if(this._animTicker < Math.abs(NOMINAL_ANIM_FRAME_RATE-Math.abs(this.velX))){
        this._animTicker +=1*du;
    }else{
        this.chooseSprite(this.velX,this.velY,nextX,nextY);
        this._animTicker = 0;
    }

    this.moveScreen();
    this.wrapPosition();
    this.gameOver();
};



/*
This function moves the screen when the
character is getting close to the bottom or the top
of the canvas
*/
var NOMINAL_SCREEN_MOVE_RATE = 8;
var SCREEN_TOP_LIMIT = 200;
var NOMINAL_SCREEN_BOTTOM_LIMIT = 570;
Character.prototype.moveScreen = function(du){
    var SCREEN_BOTTOM_LIMIT = NOMINAL_SCREEN_BOTTOM_LIMIT;
    //If player is closer to the top then the limit allows
    if (this.currPlatform) {
        SCREEN_BOTTOM_LIMIT = 700;
        //SCREEN_BOTTOM_LIMIT = NOMINAL_SCREEN_BOTTOM_LIMIT + this.activeSprite.height;
    }
    else SCREEN_BOTTOM_LIMIT = NOMINAL_SCREEN_BOTTOM_LIMIT;


    if(this.cy + this.activeSprite.height/2 <  SCREEN_TOP_LIMIT){
        //Move the screen up
        g_MOVE_SCREEN = NOMINAL_SCREEN_MOVE_RATE;
    }
    //If the player is closer to the bottom then the limit allows
    //And not at the bottom
    else if(this.cy + this.activeSprite.height/2 > SCREEN_BOTTOM_LIMIT && g_GAME_HEIGHT > 0){
        //Move the screen down
        g_MOVE_SCREEN = - NOMINAL_SCREEN_MOVE_RATE;
    }
    //Else we don't move the screen
    else{
        g_MOVE_SCREEN = 0;
    }
}

Character.prototype.gameOver = function () {
        var fallLength = 600;
        if (g_GAME_TOP_HEIGHT-fallLength > g_GAME_HEIGHT || this.cy-this.activeSprite.height/2 > g_canvas.height) {
            gameOver = true;
            g_GAME_HEIGHT  = 0;
            this.reset();
            g_background.cy = 0;
    }
}

var NOMINAL_SPEED = 1;
var NOMINAL_SLOW = 2;
var MAX_SPEED = 16;

Character.prototype.computeSpeed = function(){
    
   // console.log(this._jumping);

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

    if(this.cy+this.activeSprite.height/2 < g_canvas.height){
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
        this.velY = 0;
        this._jumping = true;
        if (speedInfluence <0.8) {
            return NOMINAL_THRUST;
        }
        else return NOMINAL_THRUST*speedInfluence;
    }
    return 0;
};

Character.prototype.wallBounce = function (velX, velY) {
    //TODO: implement this
    this.checkForRotation(velX, velY);
    if (this.isBouncing) {return;}
    if(this.cx+this.activeSprite.width/2 >= g_right_side ||
        (this.cx-this.activeSprite.width/2 <= g_left_side)) { 

        this._goingRight = !this._goingRight;
        this._goingLeft = !this._goingLeft;
        this.isBouncing = !this.isBouncing;
        
        if (this._rotationJump) {
            return this.velX *=-1.25, this.velY *= 1.25;
        } else {
            return this.velX *=-1;

        }

    }
}

Character.prototype.getRadius = function () {
    return this.scale*(this.sprite.width / 2) * 0.9;
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

