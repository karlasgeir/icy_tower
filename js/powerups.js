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
    this.sprite = this.sprite || g_sprites.power;
    var rand= util.randRange(1,100);
    //Switch to determine which powerup is spawned
    switch(true){
        case (rand <= 15):
            this.type="ruby";
            this.activeSprite = this.sprite.spaceSuit.idle;
            this.scale = 1;
            break;
        case (rand <= 25):
            this.type="smaller";
            this.activeSprite = this.sprite.smaller;
            this.scale = 1;
            break;
        case (rand <= 40):
            this.type="bigger";
            this.activeSprite = this.sprite.bigger;
            this.scale = 1;
            break;
        case (rand <=50):
            this.type="skull";
            this.activeSprite = this.sprite.reaper;
            this.scale =1;
            break;
        case (rand <= 65):
            this.type = "fire";
            this.activeSprite = this.sprite.fire;
            this.scale = 1;
            break;
        case (rand <= 100):
            this.type = "coin";
            this.activeSprite = this.sprite.coin;
            this.scale = 0.5;
            break;
        default:
            this.type = false;
            this.activeSprite = false;
    }
    this.velX = 0.5;
    this.width = this.activeSprite[0].height*this.scale;
    this.height = this.activeSprite[0].width*this.scale;
    //Get the top platform
    this.Platform = g_TOP_FLOOR;
    //Generate the powerup on the top of the platform
    this.cy= g_TOP_FLOOR.cy - g_TOP_FLOOR.halfHeight - this.height/2;
    //Generate the powerup in a random position on the platform
    this.cx= util.randRange(g_TOP_FLOOR.cx - g_TOP_FLOOR.halfWidth,g_TOP_FLOOR.cx + g_TOP_FLOOR.halfWidth);
 


    // Common inherited setup logic from Entity
    this.setup(descr);

    this._animFrame=0;
    this._animTickRate=10;
    this._animTick=0;
    this._animReverse=false;
}

Power.prototype = new Entity();


// Initial, inheritable, default values
Power.prototype.cx = 0;
Power.prototype.cy = 0;
Power.prototype.Width=this.powerWidth;
Power.prototype.Height= this.powerHeight;

//Sounds for powerups
Power.prototype.coinsound = new Audio("res/sounds/smw_coin.wav");
Power.prototype.speedPU = new Audio("res/sounds/speedPU.wav");
Power.prototype.slash = new Audio("res/sounds/reaperSlash.wav");

/*
    Update the powerups
*/
Power.prototype.update = function (du) {
    spatialManager.unregister(this);

    //Check for death
    if (this._isDeadNow && this.type !== "skull") {
        if (gameOver) { return;}
        return entityManager.KILL_ME_NOW;
    }
    //Check if powerup has gone under the canvas
    this.checkForKill();
    //Increment animation
    this.incrementFrame();

    //Move the reaper from side to side
    if(this.type === "skull") this.moveReaper(du);

    if(g_GAME_HEIGHT > 0)
    { 
        //Begin scrolling
        this.cy += g_VERTICAL_SPEED*du;
    }

    //Make sure it sticks to the platform
    this.cy = this.Platform.cy - this.Platform.halfHeight - this.getSize().height/2;

    if(!gameOver){
         spatialManager.register(this);
    } 
};

/*
    This functionn moves the reaper
*/
Power.prototype.moveReaper = function(du){
    //If he's at the right edge of the platform
    if(this.velX >0
        && this.cx + this.velX*du > this.Platform.cx + this.Platform.halfWidth){
        this.velX *= -1;
    }
    //If he's at the left edge of the platform
    else if(this.velX < 0
        &&this.cx - this.velX*du < this.Platform.cx - this.Platform.halfWidth){
        this.velX *= -1;
    }
    //move
    this.cx += this.velX*du;

}

/*
    Increment the animation frame
*/
Power.prototype.incrementFrame = function() {
    if(this._animTick < this._animTickRate){
        this._animTick += 1;
    } 
    else{
        if(this._animFrame < this.activeSprite.length-1){
            this._animFrame += 1;
        }
        else{
            this._animFrame = 0
        }
        this._animTick = 0;
    }
};

/*
    This function desides what each type of powerup
    does
*/
Power.prototype.handleCollision = function(){
    var COIN_SCORE = 20;
    switch(this.type){
        case "smaller":
            entityManager.smaller();
            break;
        case "bigger":
            entityManager.bigger();
            break;
        case "coin":
            this.coinsound.play();
            g_SCORE.score += COIN_SCORE;
            break;
        case "ruby":
            entityManager.turnOffGravity();
            entityManager.generateNotification("SUPERJUMP",0.4);
            break;
        case "skull":
            this.slash.play();
            entityManager.reaper();
            break;
        case "fire":
            this.speedPU.play();
            entityManager.speedUp();
            entityManager.generateNotification("SUPERBOOST",0.4);
            break;
    }
}

/*
    Render the powerup
*/
Power.prototype.render = function (ctx) {
    //save the original scale
    var origScale = this.activeSprite[this._animFrame].scale;
    // pass my scale into the sprite, for drawing
    this.activeSprite[this._animFrame].scale = this.scale;
    //var origScale = this.sprite.scale;
    this.activeSprite[this._animFrame].drawCentredAt(ctx, this.cx, this.cy);
    //reset the scale
    this.activeSprite[this._animFrame].scale = origScale;
    
};

/*
    Function to check if powerup has gone under the canvas
*/
Power.prototype.checkForKill = function(){
    if(this.cy>g_canvas.height + this.activeSprite[0].height){
        this.kill();
    }
};
/*
    Function to get the radius
*/
Power.prototype.getRadius = function(){
    return this.activeSprite[this._animFrame].height/2;
};

/*
    Function to get the size (height and width)
*/
Power.prototype.getSize = function(){
    return {width:this.activeSprite[this._animFrame].width*this.scale,height:this.activeSprite[this._animFrame].height*this.scale};
};

