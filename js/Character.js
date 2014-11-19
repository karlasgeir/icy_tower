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
    this._animation = {
        Frame: 0,               //Used to deside which sprite to use
        Ticker: 0,              //Used to desie when to change sprite
        Reverse: false,         //Used to know when to reverse through sprite array              
        FireFrame:0,            //Frame count for the fire
        FireTicker:0,
        revFire:false
    };
    this.rotationJump = false;  //True if the character is doing a rotation jump
    this.currPlatform = false;  //True if the character is on a platform
    this.isBouncing = false;    //True if the character is bouncing of a wall
    this.isOnFire = false;      //True if the character is on fire
    this.gravityPowerup = 0;


    // Common inherited setup logic from Entity

    this.setup(descr);
    
    // Default sprites, if not otherwise specified
    this.sprite = this.sprite || g_sprites.character; //This is an object of sprites
    //This is an active sprite (the sprite that is beeing drawn)
    this.activeSprite = this.activeSprite || g_sprites.character.idle[0];
};

//Create an Entity
Character.prototype = new Entity();

/*
    These are various nominal values
*/
Character.prototype.NOMINALS = {
    ROTATION_RATE: 15,              //Rate of rotation in rotation jump
    ANIM_FRAME_RATE: 12,            //Rate of sprite changes actually lower is faster
    SCREEN_MOVE_RATE: 8,            //Rate of screen movement 
    SCREEN_TOP_LIMIT: 200,          //If the character goes above this position the screen moves up
    SCREEN_BOTTOM_LIMIT: 570,       //If the character goes below this position the screen moves down
    ACCELX: 0.2,                    //Nominal x-acceleration of the character
    SLOW: 0.5,                      //Nominal slowdown acceleration of the character
    MAX_ACCELX: 0.8,                //Maximum x-acceleration of the character
    MAX_VELX:12,                    //Maximum x-velocity of the character
    JUMP_VEL: 1.25,                 //Nominal x-acceleration fraction when jumping
    GRAVITY: 1.2,                   //Nominal acceleration do to gravity
    ROTATION_JUMP_THRESHOLD: 10,    //the x velocity threshhold that determines
                                    //if the jump should be rottional
    THRUST: 13,                     //The nominal jump thrust
    FALL_LENGTH: 600,               //The lenght that the character has to fall to die
    BOUNCE_ROTATION: 1.5,           //The velocity multiplier when bouncing off the wall rotating
    BOUNCE:1,                       //The velocity multiplier when bouncing off the wall normally
    FIRE_LAUNCH_MULTIPLIER:-2,      //How far from the character fire will spit out
    FireTickRate:15                 //How fast the fire animation is
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
Character.prototype.flameVelocity = 6;
Character.prototype.flameSpawnRate = 1 / NOMINAL_UPDATE_INTERVAL;
Character.prototype.speed = 0;

//TODO: add audio
// HACKED-IN AUDIO (no preloading)
/*Include audio:
Played with this.jumsound.play()
Character.prototype.jumpSound = new Audio(
    "sounds/something");
*/

//Hljóðprufa
Character.prototype.jumpSound = new Audio("res/sounds/jump_01.wav");
Character.prototype.jumpSound2 = new Audio("res/sounds/jump_02.wav");
Character.prototype.bounce = new Audio("res/sounds/sprengja.wav");


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

    //Increment gravity powerup if neccesary
    if(this.gravityPowerup > 0){
        this.gravityPowerup -= du;
        if(this.gravityPowerup < 0) this.gravityPowerup = 0;
    } 
    //He can collide
    this.handleCollision();

    //Check if he's on a platform
    this.checkPlatform();

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
var TOP_PADDLE_HIT_HIGHT = 0;

Character.prototype.handleCollision = function(du){
    //Get the colliding platform if any
    var isHit = this.isColliding();
    //Check if colliding
    if(isHit){
        if (isHit && isHit instanceof Platform && this._jumping && this.velY > 0) {
            if(isHit.id > TOP_PADDLE_HIT_HIGHT ){ 
                var score = (isHit.id - TOP_PADDLE_HIT_HIGHT);        
                TOP_PADDLE_HIT_HIGHT = isHit.id;
                g_SCORE.addToScore(score);
            }
            //Make sure the characters position is on top of the platform
            this.cy = isHit.getPos().posY - isHit.getSize().height/2 - this.activeSprite.height/2;
            //Settings so the character doesn't fall throught
            g_useGravity = false;
            this._jumping = false;
            this.velY = 0;

            //Put the platform into currPlatform
            this.currPlatform = isHit;
        }
        else if(isHit && isHit instanceof Power){
            if (isHit.type=="crystal") {
                this.NOMINALS.ACCELX = 0.4;
                this.NOMINALS.MAX_ACCELX = 1.8;
                this.NOMINALS.MAX_VELX=14;
                setTimeout(this.resetxvel,2000);
            };
            isHit.handleCollision();
            isHit.kill();

        }
    }
};
Character.prototype.resetxvel = function(){
    this.NOMINALS.ACCELX = 0.2;
    this.NOMINALS.MAX_ACCELX = 0.8;
    this.NOMINALS.MAX_VELX=12;


}
 
var g_COMBO_PLAT_IDS = [];
Character.prototype.handleCombo = function() {
    
    var isHit = this.isColliding();
    var arrayLength = g_COMBO_PLAT_IDS.length;

    if (this.velY<0) {return;}

    if (isHit && isHit instanceof Platform) {
        for (var i=0; i<arrayLength; i++) {
            if (g_COMBO_PLAT_IDS[i] === isHit.id) {
                return;
            }
        }
        g_COMBO_PLAT_IDS.push(isHit.id);
    }
};


Character.prototype.setCombo = function() {

    var arrayLength = g_COMBO_PLAT_IDS.length;
    var currentID = g_COMBO_PLAT_IDS[arrayLength-1];
    var lastID = g_COMBO_PLAT_IDS[arrayLength-2];
    console.log(g_FIREBOLTS);

    var comboBreaker = currentID - lastID;

    var isHit = this.isColliding();

    if (comboBreaker >= 2) {
        g_COMBO = true;
    } else {
        g_PLATS_GONE_IN_COMBO = 0;
        g_PLATS_IN_COMBO = [];
        g_FIREBOLTS = 0;
        g_COMBO = false;
    }
};

var g_PLATS_IN_COMBO = [];

Character.prototype.platsInCombo = function() {
    
    var isHit = this.isColliding();
    var arrayLength = g_PLATS_IN_COMBO.length;


    if (isHit && isHit instanceof Platform) {
        var lowestPlat = g_PLATS_IN_COMBO[0];
        for (var i=0; i<arrayLength; i++) {
            if (g_PLATS_IN_COMBO[i] === isHit.id) {
                return;
            }
        }
        if (g_COMBO) {
            var highestPlat = isHit.id;
            g_PLATS_IN_COMBO.push(highestPlat);
        }
        if (!g_COMBO) {
            g_PLATS_IN_COMBO = [];
        }
    }
    var numOfPlatsInCombo =g_PLATS_IN_COMBO[arrayLength-1]-g_PLATS_IN_COMBO[0];
    g_PLATS_GONE_IN_COMBO = numOfPlatsInCombo;

};

/*
    This function creates the flames
*/
Character.prototype.makeFlames = function () {
    //Flames are only created if the jump is rotational 
    if (!this._rotationJump) {return;}
    if (!g_COMBO) { return;}

    //Get the rotational offset
    var dX = +Math.sin(this.rotation);
    var dY = -Math.cos(this.rotation);
    //Set the launch distance
    var launchDist = this.getRadius() * this.NOMINALS.FIRE_LAUNCH_MULTIPLIER;

    //Calculate the x and y velocities
    var relVel = this.flameVelocity;
    var relVelX = dX * relVel;
    var relVelY = dY * relVel;

    var randomXFactor = util.randRange(-3,3);
    var randomYFactor = util.randRange(-6,6);

    var flameVelX = randomXFactor*(+this.velX + relVelX); 
    var flameVelY = randomYFactor*(this.velY + relVelY);
    var flameGrav = 1;

    //Generate the flame
    for (var i=0; i<g_FIREBOLTS; i++) {
        entityManager.generateFlame(
            this.cx + dX * launchDist,
            this.cy + dY * launchDist,
            flameVelX, 
            flameVelY,
            flameGrav,
            this.rotation);
    }  
}


/*
    This function checks if the character should be
    rotated, and performs the rotation
*/
Character.prototype.computeRotation = function(du){
    //If character is jumping, and it should be rotational
    if(this._rotationJump && this._jumping){
        var speedInfluence = 0.125*Math.abs(this.velX);
        //If he's moving right the rotation is to the right
        if (this._goingRight) this.rotation += speedInfluence*(Math.PI/this.NOMINALS.ROTATION_RATE)*du;
        //If he's moving left the rotation is to the left
        else this.rotation -= speedInfluence*(Math.PI/this.NOMINALS.ROTATION_RATE)*du;
    }
    else this.rotation = 0;
};



/*
    This function performs the substeps of the
    update function
*/
Character.prototype.computeSubStep = function (du) {


    //Register the position before change
    var prevX = this.cx;
    var prevY = this.cy;
   
    //Compute the x acceleration
    this.computeAccelX(du);

    //Apply the x acceleration
    this.applyAccelX(du);
    //Compute the y acceleration
    this.accelY = this.computeGravity();
    this.velY -= this.computeThrustMag();   
    
    //Apply the y acceleration
    this.applyAccelY(du);
    
    //Call the functions that creates flames
    this.makeFlames();

    //Handle combo
    this.handleCombo();
    this.setCombo();
    this.platsInCombo();

    //Performs the wallBounce
    
    this.wallBounce();

    //Check for special cases
    this.checkCases();
   
    //Used to deside which sprite to use
    var nextX = prevX + this.velX * du;
    var nextY = prevY + this.velY * du;
    
    //Increment the animTicker
    if(this._animation.Ticker < Math.abs(this.NOMINALS.ANIM_FRAME_RATE-Math.abs(this.velX))){
        this._animation.Ticker +=du;
    }
    //Change the sprite and reset animTicker
    else{
        this.chooseSprite(this.velX,this.velY,nextX,nextY);
        this._animation.Ticker = 0;
    }
    //Increment the fire animation ticker
    if(this._animation.FireTicker <= this.NOMINALS.FireTickRate){
        this._animation.FireTicker += du;
    }
    else{
        this._animation.FireTicker = 0;
    }


    //Check if screen needs to be moved
    this.moveScreen();
    this.wrapPosition();
    //Check for game over
    this.gameOver();
};
Character.prototype.computeAccelX = function(du){
    //Shorter notation
    var accelX = this.NOMINALS.ACCELX
    //If no directional key is pressed and not jumping
    if (!keys[this.KEY_RIGHT] && !keys[this.KEY_LEFT]) {
        //If the character is stationary we do nothing
        if (this.velX===0 && this.accelX===0) {return;}
        //If the character is moving left
        else if (this.velX<0) {
            //If the next velocity is going to change sign
            if(this.velX + (this.accelX + this.NOMINALS.SLOW)*du >0) {
                //Character should be stationary
                this.accelX=0;
                this.velX=0;
            }
            //We slow down the acceleration
            else this.accelX += this.NOMINALS.SLOW;
        }
        //If the character is moving right
        else if (this.velX>0) {
            //If the velocity is going to change sign
            if(this.velX + (this.accelX+this.NOMINALS.SLOW)*du <0){
                //Character should be stationary
                this.accelX=0;
                this.velX=0;
            }
            //We slow down the acceleration
            else this.accelX -= this.NOMINALS.SLOW;
        }
    }
    //If right is pressed
    if(keys[this.KEY_RIGHT]) {
        //If we are moving right
        if(this.velX > 0){
            this._goingRight = true;
            this._goingLeft =  false;
        }
        //If we are still moving left
        else if(this.velX <0 && !this.isBouncing){
            //Slow down the velocity quickly
            this.velX*=0.5
        }
        //add to teh acceleration
        this.accelX += accelX;
    }
    else if(keys[this.KEY_LEFT]) {
        //If we are moving left
        if(this.velX < 0){
            this._goingRight = false;
            this._goingLeft =  true;
        }
        //If we are still moving right 
        else if(this.velX >0 && !this.isBouncing){
            //Slow down the velocity quickly
            this.velX*=0.5
        }
        //add to the acceleration
        this.accelX -= accelX;
    }
    //Make sure the acceleration is in the correct range
    this.accelX = util.clampRange(this.accelX,-this.NOMINALS.MAX_ACCELX,this.NOMINALS.MAX_ACCELX);
};


/*
    This function checks some special cases and
    sets options accordingly
*/
Character.prototype.checkCases = function(){
    //If the character is landing 
    if (this.activeSprite.height/2 + this.cy >= g_canvas.height 
        && (g_GAME_HEIGHT === 0 || !this.currPlatform)) {
        this._jumping = false;
        this._falling = false;
        this._roationJump = false;
        this.isBouncing = false;
    }
    //If the character is falling
    if (this.velY > 0) {
        this._falling = true;
    }
    //If the character is on a platform
    if (this.currPlatform) {
        this.isBouncing = false;
    }

    //If character is stationary
    if(this.velX===0){
        this._goingLeft = false;
        this._goingRight = false;
        this.isOnFire = false;
    }
    if (this.velX !== 0) {
        this.isOnFire = true;
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
    //Screen should not move when the menu screen is up
    if (g_MENU_SCREEN) {
        screenIsMoving = false;
    }
    //If we are on a platform we need to be able to travel with it under the canvas
    if (this.currPlatform) {
        //TODO: Change from magic number
        SCREEN_BOTTOM_LIMIT = 700;
        //SCREEN_BOTTOM_LIMIT = this.NOMINALS.SCREEN_BOTTOM_LIMIT + this.activeSprite.height;
    }
    //If we are not on a platform we use the nominal bottom limit
    else SCREEN_BOTTOM_LIMIT = this.NOMINALS.SCREEN_BOTTOM_LIMIT;

    //If player is closer to the top then the limit allows
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


/*
    This function applys the y component of the
    acceleration (using average velocity)
*/
Character.prototype.applyAccelY = function(du){
    //Calculate final velocty
    var finalv = this.velY + this.accelY*du;
    //Calculate average velocity
    this.velY = (this.velY + finalv)/2;
    
    //If the character is on a platform it has the same y-velocity
    //as the platform
    if(this.currPlatform && g_GAME_HEIGHT > 0){
        this.velY += g_VERTICAL_SPEED;
    }

    //Apply the velocity
    this.cy += this.velY*du;
}

/*
    This function applys the x component of the
    acceleration (using average velocity)
*/
Character.prototype.applyAccelX = function(du){
    //Calculate the final velocity
    var final_velX = this.velX + this.accelX*du;
    //Calculate the average velocity
    this.velX = (this.velX + final_velX)/2;
    //Make sure the velocity is in the correct range
    this.velX = util.clampRange(this.velX,-this.NOMINALS.MAX_VELX,this.NOMINALS.MAX_VELX);
    //Apply the velocity
    this.cx += this.velX*du;
};

/*
    This function calculates the gravity that
    should be returned
*/
var NOMINAL_GRAVITY_MARGIN= 1;
Character.prototype.computeGravity = function () {
    var gravity = this.NOMINALS.GRAVITY
    if(this.gravityPowerup > 0){

        gravity = 0.5*this.NOMINALS.GRAVITY;
        console.log("GRAVITY",gravity);
    } 
    if(this.cy+this.activeSprite.height/2+NOMINAL_GRAVITY_MARGIN < g_canvas.height || g_GAME_HEIGHT !== 0 ){
        return g_useGravity ? gravity : 0;
    }
    else{
        this.velY = 0;
    }
    return 0;
};

var toggle = 0;
/*
    This computes the magnitude of the jump
    acceleration
*/
Character.prototype.computeThrustMag = function () {
    //influence from the x velocity
    var speedInfluence = 0.1*Math.abs(this.velX);
    //Needs more work
    if ((keys[this.KEY_JUMP] && !this._jumping) ) {
        //Reset the y velocity
        this._jumping = true;
       
        if (toggle ===4) {
            this.jumpSound2.play();
            toggle = 0;
        }
        else{
        this.jumpSound.play();
        toggle += 1;
        }
        //We don't want x-velocity to decrease jump height
        if (speedInfluence<1) {
            return this.NOMINALS.THRUST;
        }
        //x-velocity can increase jump height
        else return this.NOMINALS.THRUST*speedInfluence;
    }
    return 0;

};

/*
    This function implements the wall bounce
*/
var REBOUNCE_LIMIT = 200;
Character.prototype.wallBounce = function () {
    if(this.isBouncing){
        this.bounce.play();
        if(this.cx+this.activeSprite.width/2 + REBOUNCE_LIMIT >= g_right_side ||
        (this.cx-this.activeSprite.width/2 - REBOUNCE_LIMIT <= g_left_side)){
            return;
        }
        else this.isBouncing = false;
    }

    if(this.cx+this.activeSprite.width/2 >= g_right_side ||
        (this.cx-this.activeSprite.width/2 <= g_left_side)) {
        if(this._goingLeft) var expX = this.cx-this.activeSprite.width/2;
        else var expX = this.cx + this.activeSprite.width/2; 
        entityManager.generateExplotion(expX,this.cy);
        this._goingRight = !this._goingRight;
        this._goingLeft = !this._goingLeft;
        this.isBouncing = true;

        //revert the x velocity and leave the y velocity unchanged
        if (this._rotationJump) {
            return this.velX *=-this.NOMINALS.BOUNCE_ROTATION, this.velY *= this.NOMINALS.BOUNCE_ROTATION;
        } else {
            return this.velX *=-this.NOMINALS.BOUNCE, this.velY *= this.NOMINALS.BOUNCE;
        }
    }
};

Character.prototype.gameOver = function () {
        var fallLength = this.NOMINALS.FALL_LENGTH;
        //If the player has the fallength or fallen below the canvas
        if (g_GAME_TOP_HEIGHT-fallLength > g_GAME_HEIGHT || this.cy-this.activeSprite.height/2 > g_canvas.height) {
            //GAME IS OVER
            gameOver = true;
    }
};

/*
    Function to get the radius
*/
Character.prototype.getRadius = function () {
    return (this.activeSprite.width / 2) * 0.9;
};

/*
    Function to reset the character
*/
Character.prototype.reset = function () {
    TOP_PADDLE_HIT_HIGHT = 0;
    this.setPos(this.reset_cx, this.reset_cy);
    this.halt();
};

/*
    Function to halt the character
*/
Character.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};
/*
    Function that renders the correct sprite
*/
Character.prototype.render = function (ctx) {
    
    //Remember the original scale
    var origScale = this.sprite.scale;
    //Set scale
    this.sprite.scale = this._scale;
    //Draw the sprite
    this.activeSprite.drawCentredAt(ctx, this.cx, this.cy,this.rotation);
    //Reset the scale
    this.sprite.scale = origScale;
    if((this.velY === 0 || this.currPlatform) && this.isOnFire){
        g_sprites.fire[this._animation.FireFrame].drawCentredAt(ctx,this.cx-this.activeSprite.width/6,this.cy+this.activeSprite.height/6);
        if(this._animation.FireFrame === 0 && this._animation.revFire){
            this._animation.revFire = false;
            this._animation.FireFrame += 1;
        }
        else if(this._animation.FireFrame < g_sprites.fire.length-1 ){
            if(this._animation.revFire) this._animation.FireFrame -= 1;
            else this._animation.FireFrame += 1;
        }
        else if(this._animation.FireFrame === g_sprites.fire.length-1){
            this._animation.revFire = true;
            this._animation.FireFrame -= 1;
        }
        
    }
    else {
        this.isOnFire = false;
        this._animation.FireFrame = 0 
    };
   
};

/*
    This function checks if the character should make a rotation jump
*/
Character.prototype.checkForRotation = function(velX,velY) {
    //If the velocity is greater than the threshold and is jumping
    if((Math.abs(velX) > this.NOMINALS.ROTATION_JUMP_THRESHOLD) && this._jumping) {
        //We perform rotation jump
        this._rotationJump = true;
    }
    else {
        //We don't perform it
        this._rotationJump = false;
    }
};

/*
    This function chosses which sprite to render
*/
Character.prototype.chooseSprite = function (velX,velY,nextX,nextY){
    var sprite_base = this.sprite;
    //Check if the jump is rotational
    this.checkForRotation(velX,velY);
    
    //Check if in transition
    if(
        this._goingLeft && velX > 0         //Transition from left to right
        || this._jumping && velY === 0      //Transition from jump to ground
        || !this._goingLeft && velX < 0     //Transition from right to left
        || (this._goingLeft || this._goingRight) && velX === 0 //Transition from movement to stationary
        ){
        this._animation.Frame = 0;
    }
    //If there's speed in y direction we are jumping
    if(velY !== 0) this._jumping = true;
    else this._jumping = false;
    
    //If we are going to the left
    if(this._goingLeft){
        //Use left sprite
        sprite_base = this.sprite.rev;
    }

    //If jumping
    if(this._jumping && !this.currPlatform){
        //If we are bouncing of the wall
        if(this.isBouncing){
            if(this._animation.Frame > 1) this._animation.Frame = 0;
            this.activeSprite = sprite_base.edge[this._animation.Frame];
            if(this._animation.Frame === 0){
                this._animation.Frame =1;
            }
            else{
                this._animation.Frame = 0;
            }  
        }
        //If we are moving and should do a rotation jump
        else if(this._rotationJump){
            //We choose the rotation jum sprite
            this.activeSprite = this.sprite.rotate;
            this._animation.Frame = 0;
        }
        //If we are not moving in x direction we jump straight up
        else if(velX === 0){
            //We choose the jump straight sprite
            this.activeSprite = this.sprite.jump[3];
            this._animation.Frame = 0;
        }
        //We loop through the jump sprites
        else{
            if(this._animation.Frame > 1) this._animation.Frame = 0;
            this.activeSprite = sprite_base.jump[this._animation.Frame];
            if(this._animation.Frame === 0){
                this._animation.Frame =1;
            }
        }
    }
    //We are not jumping
    else{
        //If we are stationary on the ground or platform
        if(velX === 0){
            //loop through the idle sprites
            if(this._animation.Frame > 2) this._animation.Frame = 0;
            this.activeSprite = this.sprite.idle[this._animation.Frame];
            if(this._animation.Frame === 0 && this._animation.Reverse){
                this._animation.Reverse = false;
            }
            else if(this._animation.Frame === 2 && !this._animation.Reverse){
                this._animation.Reverse = true;
            }
            if(this._animation.Reverse) this._animation.Frame -=1;
            else this._animation.Frame +=1;
        }
        //If we are moving
        else{
            //Loop through the walk sprites
            if(this._animation.Frame > 3) this._animation.Frame=0;
            this.activeSprite = sprite_base.walk[this._animation.Frame];
            if(this._animation.Frame === 0 && this._animation.Reverse){
                this._animation.Reverse = false;
            }
            else if(this._animation.Frame === 3 && !this._animation.Reverse){
                this._animation.Reverse = true;
            }
            if(this._animation.Reverse) this._animation.Frame -=1;
            else this._animation.Frame +=1;
        }

    } 
};

