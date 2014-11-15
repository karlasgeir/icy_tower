// ===============
// CHARACTER STUFF
// ===============
"use strict";
/* jshint browser: true, devel: true, globalstrict: true */
// A generic contructor which accepts an arbitrary descriptor object
function Character(descr) {
    this._scale = 1;            //The scale that the sprite is drawn in
    this.rememberResets();      //Sets the reset positions
    this._jumping = false;      //True if character is jumping
    this._falling = false;      //True if character is falling
    this._goingLeft = false;    //True if character is going left
    this._goingRight = false;   //True if character is going right
    this._running = false;      //True if character is running
    this._wall = false;         //True if character is at wall
    this._animFrame = 0;        //Used to deside which sprite to use
    this._animTicker = 0;       //Used to desie when to change sprite
    this.rotationJump = false;  //True if the character is doing a rotation jump
    this.currPlatform = false;  //True if the character is on a platform
    this.isBouncing = false;    //True if the character i bouncing of a wall

    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprites, if not otherwise specified
    this.sprite = this.sprite || g_sprites.character; //This is an object of sprites
    //This is an active sprite (the sprite that is beeing drawn)
    this.activeSprite = this.activeSprite || g_sprites.character.idle[0];
};

//Create an Entity
Character.prototype = new Entity();

Character.prototype.NOMINALS = {
    ROTATION_RATE: 0.2,          //Rate of rotation in rotation jump
    ANIM_FRAME_RATE: 20,        //Rate of sprite changes
    SCREEN_MOVE_RATE: 8,        //Rate of screen movement 
    SCREEN_TOP_LIMIT: 200,      //If the character goes above this position the screen moves up
    SCREEN_BOTTOM_LIMIT: 570,   //If the character goes below this position the screen moves down
    ACCELX: 0.1,                   //Nominal x-acceleration of the character
    SLOW: 0.4,                    //Nominal slowdown acceleration of the character
    MAX_ACCELX: 0.8,              //Maximum x-velocity of the character
    MAX_VELX:14,
    JUMP_VEL: 1.25,           //Nominal x-acceleration fraction when jumping
    GRAVITY: 1,                  //Nominal acceleration do to gravity
};


//A function to remember the positions for reset
Character.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = g_canvas.width/2;
    this.reset_cy = g_canvas.height;
};

/*
    Key codes related to the character
    NOTE: Should we change the character codes to left/right? Or maybe put it into an options screen? 
*/
Character.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Character.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);
Character.prototype.KEY_JUMP   = 32; //This is the char code for space

// Initial, inheritable, default values
Character.prototype.rotation = 0;
Character.prototype.cx = 200;
Character.prototype.cy = 200;
Character.prototype.velX = 0;
Character.prototype.velY = 0;
Character.prototype.accelX = 0;
Character.prototype.accelY = 0;
Character.prototype.numSubSteps = 1;
Character.prototype.speed = 0;

//TODO: add audio
// HACKED-IN AUDIO (no preloading)
/*Include audio:
Played with this.jumsound.play()
Character.prototype.jumpSound = new Audio(
    "sounds/something");
*/

/*
    This function updates everything about
    the character including it's position, 
    rotation, which sprite to use and so on.
    It also updates the game height
*/
Character.prototype.update = function (du) {    
    //Unregister from spatial manager
    spatialManager.unregister(this);

    //Check for death
    if(this._isDeadNow){return entityManager.KILL_ME_NOW;}

    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }


    //Do rotation in jump
    this.computeRotation(du);
    
    //Update game height
    this.gameHeight = g_canvas.height - this.cy - this.activeSprite.height/2 + g_GAME_HEIGHT;

    //If the character is traveling down
    if(this._jumping && this.velY > 0){
        //He can collide
        this.handleCollision();
    }
    else{
        //Check if he's on a platform
        this.checkPlatform();
    }
    //If game is not over
    if(!gameOver){
        //Reregister in the spatial manager
        spatialManager.register(this);
    }
};

/*
    This function checks if the character is on a platform
    and sets various settings accordingly
*/
Character.prototype.checkPlatform = function(){
    //If the character is registered on a platform
    if(this.currPlatform){
        //Get some variables from the platform
        var pos = this.currPlatform.getPos();
        var size = this.currPlatform.getSize();
        var gameHeight = this.currPlatform.getGameHeight();
        //Check if the character is still on the platform
        if(this.cx - this.activeSprite.width/2 < pos.posX+size.width/2
            && this.cx + this.activeSprite.width/2 > pos.posX - size.width/2
            && util.isBetween(this.getGameHeight(),gameHeight-3,gameHeight+5)){
            //Set settings accordingly
            g_useGravity = false;
            this._jumping = false;
            this.velY = 0;
        }
        //If he isn't on the platform any more
        else{
            //Set settings accordingly
            this.currPlatform = false;
            g_useGravity = true;
            this._jumping = true;
        }
    }
};

/*
    This function checks if the character is colliding with a
    platform and handles the collision
*/
Character.prototype.handleCollision = function(du){
    //Get the colliding platform if any
    var isHit = this.isColliding();
    //Check if colliding
    if (isHit) {
        //Make sure the characters position is on top of the platform
        this.cy = isHit.getPos().posY - isHit.getSize().height/2 - this.activeSprite.height/2;
        //Settings so the character doesn't fall throught
        g_useGravity = false;
        this._jumping = false;
        this.velY = 0;
        //Put the platform into currPlatform
        this.currPlatform = isHit;
    }   
};

/*
    This function checks if the character should be
    rotated, and performs the rotation
*/
Character.prototype.computeRotation = function(du){
    //If character is jumping, and it should be rotational
    if(this._rotationJump && this._jumping){
        var speedInfluence = 0.1*Math.abs(this.velX);
        //If he's moving right
        if (this._goingRight) this.rotation += (speedInfluence*Math.PI/this.NOMINALS.ROTATION_RATE)*du;
        else this.rotation -= (Math.PI/this.NOMINALS.ROTATION_RATE)*du;
    }
    else this.rotation = 0;
};



/*
    This function performs the substeps of the
    update function
*/
Character.prototype.computeSubStep = function (du) {
    //Performs the wallBounce
    this.wallBounce();
    var prevX = this.cx;
    var prevY = this.cy;
    
    //Check for special cases
    this.checkCases();
    
    //Compute the speed and set the velocity
    this.computeAccelX(du);

    this.applyAccelX(du);

    var accelY = -this.computeThrustMag();
    accelY += this.computeGravity();
    
    var finalv = this.velY + accelY*du;
    this.velY = (this.velY + finalv)/2;
    this.cy += this.velY*du;

    if(this.currPlatform && g_GAME_HEIGHT > 0){
        this.cy +=Platform.prototype.verticalSpeed*du;
    }

    var nextX = prevX + this.velX * du;
    var nextY = prevY + this.velY * du;
    
    
    if(this._animTicker < Math.abs(this.NOMINALS.ANIM_FRAME_RATE-Math.abs(this.velX))){
        this._animTicker +=1*du;
    }else{
        this.chooseSprite(this.velX,this.velY,nextX,nextY);
        this._animTicker = 0;
    }
    this.moveScreen();
    this.wrapPosition();
    this.gameOver();
};
var counter=0;;
Character.prototype.computeAccelX = function(du){
    if(this._jumping){
        this.accelX = 0;
    }

    //Developmental
    if(counter > 100){
        console.log("ACCEL",this.accelX);
        console.log("VEL",this.velX);
        console.log("POS",this.cx,this.cy);
        counter = 0;
    }
    else counter +=1;
    var accelX = this.NOMINALS.ACCELX
    
    if (!keys[this.KEY_RIGHT] && !keys[this.KEY_LEFT]) {
        if (this.velX===0 && this.accelX===0) {return;}
        if (this.velX<0) {
            if(this.velX + (this.accelX + this.NOMINALS.SLOW)*du >0) {
                this.accelX=0;
                this.velX=0;
            }
            else this.accelX += this.NOMINALS.SLOW;
        }
        if (this.velX>0) {
            if(this.velX + (this.accelX+this.NOMINALS.SLOW)*du <0){
                this.accelX=0;
                this.velX=0;
            }
            else this.accelX -= this.NOMINALS.SLOW;
        }
    }
    if(keys[this.KEY_RIGHT]) {
        if(this.velX > 0){
            this._goingRight = true;
            this._goingLeft =  false;
        }

        if(this.accelX + accelX > this.NOMINALS.MAX_ACCELX) {
            this.accelX = this.NOMINALS.MAX_ACCELX;
        }
        else {
            this.accelX += accelX;
        }
    }
    else if(keys[this.KEY_LEFT]) {
        if(this.velX < 0){
            this._goingRight = false;
            this._goingLeft =  true;
        }

        if(this.accelX - accelX < -this.NOMINALS.MAX_ACCELX) {
            this.accelX = -this.NOMINALS.MAX_ACCELX;
        }
        else {
            this.accelX -= accelX;
        }
    } 
};


/*
    This function checks some special cases and
    sets options accordingly
*/
Character.prototype.checkCases = function(){
    if (this.velY === 0 && (g_GAME_HEIGHT === 0 || !this.currPlatform)) {
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
}

/*
This function moves the screen when the
character is getting close to the bottom or the top
of the canvas
*/
var screenIsMoving = false;
Character.prototype.moveScreen = function(du){
    var SCREEN_BOTTOM_LIMIT = this.NOMINALS.SCREEN_BOTTOM_LIMIT;
    //If player is closer to the top then the limit allows
    if (g_MENU_SCREEN) {
        screenIsMoving = false;
    }
    
    if (this.currPlatform) {
        //TODO: Change from magic number
        SCREEN_BOTTOM_LIMIT = 700;
        //SCREEN_BOTTOM_LIMIT = this.NOMINALS.SCREEN_BOTTOM_LIMIT + this.activeSprite.height;
    }
    else SCREEN_BOTTOM_LIMIT = this.NOMINALS.SCREEN_BOTTOM_LIMIT;


    if(this.cy + this.activeSprite.height/2 <  this.NOMINALS.SCREEN_TOP_LIMIT){
        //Move the screen up
        g_MOVE_SCREEN = this.NOMINALS.SCREEN_MOVE_RATE;
        screenIsMoving = true;
    }
    //If the player is closer to the bottom then the limit allows
    //And not at the bottom
    else if(this.cy + this.activeSprite.height/2 > SCREEN_BOTTOM_LIMIT && g_GAME_HEIGHT > 0){
        //Move the screen down
        g_MOVE_SCREEN = - this.NOMINALS.SCREEN_MOVE_RATE;
        screenIsMoving = true;
    }
    //Else we don't move the screen
    else{
        g_MOVE_SCREEN = 0;
        screenIsMoving = false;
    }
};






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
};

Character.prototype.applyAccelX = function(du){

    var initial_velX = this.velX;
    var average_velX = 0;
    var final_velX = initial_velX + this.accelX*du;

    this.velX = (initial_velX + final_velX)/2;
    if(this.velX > this.NOMINALS.MAX_VELX) this.velX=this.NOMINALS.MAX_VELX;
    else if(this.velX < -this.NOMINALS.MAX_VELX) this.velX=-this.NOMINALS.MAX_VELX;
    this.cx += this.velX*du;

};




Character.prototype.computeGravity = function () {
    var gravity = this.NOMINALS.GRAVITY;
    if (this.velY>0) {
        gravity = 1.50;
    }

    if(this.cy+this.activeSprite.height/2 < g_canvas.height){
        return g_useGravity ? gravity : 0;
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
        if (speedInfluence<1) {
            return NOMINAL_THRUST;
        }
        else return NOMINAL_THRUST*speedInfluence;
    }
    return 0;

};

Character.prototype.wallBounce = function () {
    /*
    if (this.isBouncing) {
        return;
    }
    */
    if(this.cx+this.activeSprite.width/2 >= g_right_side ||
        (this.cx-this.activeSprite.width/2 <= g_left_side)) { 
        console.log("SHOUld bounce");
        this._goingRight = !this._goingRight;
        this._goingLeft = !this._goingLeft;
        this.isBouncing = !this.isBouncing;

        if (this._rotationJump) {
            return this.velX *=-1.25, this.velY *= 1.25;
        } else {
            return this.velX *=-1, this.velY *=-1;
        }
    }     
};

Character.prototype.gameOver = function () {
        //TODO: change from magic number
        var fallLength = 600;
        if (g_GAME_TOP_HEIGHT-fallLength > g_GAME_HEIGHT || this.cy-this.activeSprite.height/2 > g_canvas.height) {
            gameOver = true;
            g_GAME_HEIGHT  = 0;
            g_background.cx = 0;
            NUMBER_OF_PLATFORMS = 8;
            this.reset();
            g_background.cy = 0;
    }
};

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
};

var ROTATION_JUMP_THRESHOLD = 8;
Character.prototype.chooseSprite = function (velX,velY,nextX,nextY){
    var prevLeft = this._goingLeft;
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
    if(nextX < this.activeSprite.width/2+g_left_side || nextX > g_right_side - this.activeSprite.width/2){
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
};

