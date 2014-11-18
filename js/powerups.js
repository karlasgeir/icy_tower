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
    var rand= util.randRange(1,20);
    switch(true){
        case (rand <= 5):
            this.type="ruby";
            this.activeSprite = this.sprite.ruby;
            break;
        case (rand <=6):
            this.type="skull";
            this.activeSprite = this.sprite.skull;
            break;
        case (rand <= 12):
            this.type = "crystal";
            this.activeSprite = this.sprite.crystal;
            break;
        case (rand <= 20):
            this.type = "coin";
            this.activeSprite = this.sprite.coin;
            break;
        default:
            this.type = false;
            this.activeSprite = false
    } 
    this.width = this.activeSprite[0].height;
    this.height = this.activeSprite[0].width;
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
Power.prototype.diamondsound = new Audio("res/sounds/demant.wav");

Power.prototype.update = function (du) {
    spatialManager.unregister(this);
     
    //Check for death
    if (this._isDeadNow) {
        this.coinsound.play();
        return entityManager.KILL_ME_NOW;
    }

    this.checkForKill();

    this.incrementFrame();

    if(g_GAME_HEIGHT > 0)
    { 
        //Begin scrolling
        
        this.cy += g_VERTICAL_SPEED*du;
    }
    if(!gameOver){
         spatialManager.register(this);
    } 
};

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
            g_SCORE.score += 20;
            break;
        case "ruby":
            entityManager.turnOffGravity();
            break;
        case "skull":
            //gameOver = true;
            break;
        case "crystal":
            break;
    }
}

Power.prototype.render = function (ctx) {

    //this.sprite.drawWrappedCentredAt(ctx, this.cx, this.cy, 0);
    
   // var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;
    this.activeSprite[this._animFrame].drawCentredAt(ctx, this.cx, this.cy);
    
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
    return {width:this.activeSprite[this._animFrame].width,height:this.activeSprite[this._animFrame].height};
}

};