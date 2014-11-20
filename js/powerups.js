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
    switch(true){
        case (rand <= 15):
            this.type="ruby";
            this.activeSprite = this.sprite.spaceSuit.idle;
            this.scale = 1;
            break;
        case (rand <=20):
            this.type="skull";
            this.activeSprite = this.sprite.reaper;
            this.scale =1;
            break;
        case (rand <= 40):
            this.type = "fire";
            this.activeSprite = this.sprite.fire;
            this.scale = 1;
            break;
        case (rand <= 100):
            this.type = "coin";
            this.activeSprite = this.sprite.coin;
            this.scale = 0.8;
            break;
        default:
            this.type = false;
            this.activeSprite = false;
    }
    this.velX = 0.5;
    this.width = this.activeSprite[0].height*this.scale;
    this.height = this.activeSprite[0].width*this.scale;
    this.Platform = g_TOP_FLOOR;
    this.cy= g_TOP_FLOOR.cy - g_TOP_FLOOR.halfHeight - this.height/2;
    this.cx= util.randRange(g_TOP_FLOOR.cx - g_TOP_FLOOR.halfWidth,g_TOP_FLOOR.cx + g_TOP_FLOOR.halfWidth);
    
    //console.log("dfafdasfdasfdasÞ:   "+this.powerWidth);
     this.powerID = 0;

 


    // Common inherited setup logic from Entity
    this.setup(descr);

    this._animFrame=0;
    this._animTickRate=10;
    this._animTick=0;
    this._animReverse=false;
}

Power.prototype = new Entity();


//Power.prototype.lifeSpan = 2000 / NOMINAL_UPDATE_INTERVAL;
// Initial, inheritable, default values
Power.prototype.cx = 0;
Power.prototype.cy = 0;
Power.prototype.Width=this.powerWidth;
Power.prototype.Height= this.powerHeight;

//Hljod fyrir powerup
Power.prototype.coinsound = new Audio("res/sounds/smw_coin.wav");
Power.prototype.speedPU = new Audio("res/sounds/speedPU.wav");
Power.prototype.dead = new Audio("res/sounds/dead.wav");

Power.prototype.update = function (du) {
    spatialManager.unregister(this);

    //Check for death
    if (this._isDeadNow) {
        if (gameOver) { return;}
        return entityManager.KILL_ME_NOW;
    }
    this.checkForKill();

    this.incrementFrame();

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


Power.prototype.moveReaper = function(du){
    if(this.velX >0
        && this.cx + this.velX*du > this.Platform.cx + this.Platform.halfWidth){
        this.velX *= -1;
    }
    else if(this.velX < 0
        &&this.cx - this.velX*du < this.Platform.cx - this.Platform.halfWidth){
        this.velX *= -1;
    }
    
    this.cx += this.velX*du;

}

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

Power.prototype.handleCollision = function(){
    //TODO: make powerups do something
    switch(this.type){
        case "coin":
            //TODO: change from magic number
            this.coinsound.play();
            g_SCORE.score += 20;
            break;
        case "ruby":
            entityManager.turnOffGravity();
            entityManager.generateNotification("SUPERJUMP",0.4);
            break;
        case "skull":
            this.dead.play();
            gameOver = true;
            break;
        case "fire":
            this.speedPU.play();
            entityManager.speedUp();
            entityManager.generateEffect(this.cx,this.cy,"FIREBLAST");
            entityManager.generateNotification("SUPERBOOST",0.4);
            break;
    }
}

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

Power.prototype.getID = function() {
    return this.powerID;
}
Power.prototype.checkForKill = function(){
    if(this.cy>g_canvas.height + this.activeSprite[0].height){
        this.kill();
    }

Power.prototype.getRadius = function(){
    return this.activeSprite[this._animFrame].height/2;
}

Power.prototype.getSize = function(){
    return {width:this.activeSprite[this._animFrame].width*this.scale,height:this.activeSprite[this._animFrame].height*this.scale};
}

};