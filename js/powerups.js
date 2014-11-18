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
var power_is_ruby = false;
var power_is_crystal= false;
var power_is_skull =false;
var power_is_coin = false;

var NOMINAL_VERTICAL_SPEED = 0.5;

// A generic contructor which accepts an arbitrary descriptor object
function Power(descr) {


    this.sprite = this.sprite || g_sprites.power;
    this.activeSprite = this.activeSprite || g_sprites.power.ruby[0];

    this.powerWidth = this.activeSprite.height;
    this.powerHeight = this.activeSprite.width;
    //console.log("dfafdasfdasfdasÞ:   "+this.powerWidth);
     this.powerID = 0;

 


    // Common inherited setup logic from Entity
    this.setup(descr);

    this._animFrame=0;
}

Power.prototype = new Entity();


//Power.prototype.lifeSpan = 2000 / NOMINAL_UPDATE_INTERVAL;
// Initial, inheritable, default values
Power.prototype.cx = 0;
Power.prototype.cy = 0;
Power.prototype.Width=this.powerWidth;
Power.prototype.Height= this.powerHeight;
Power.prototype.verticalSpeed = NOMINAL_VERTICAL_SPEED;
//Power.prototype.type=skull;

Power.prototype.update = function (du) {
    spatialManager.unregister(this);
     
    this.pickSprite();

   /* var isHit = this.isColliding();
    if (isHit) {
        var powerID = this.getID();
    //    console.log(platID);
    }*/
    
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    if(g_GAME_HEIGHT > 0)
    { 
        //Begin scrolling
        this.cy += this.verticalSpeed*du;
    }
    if(!gameOver){
         spatialManager.register(this);
    } 
    //setTimeout(this.update,1000000);

};

Power.prototype.pickSprite = function() {

    this.checkForKill();
    if (powerSprite_is_alive) { 

        if(power_is_ruby){
         var sprite_base=this.sprite;
            if(this._animFrame>=5){
                this._animFrame=0;
            }
            this._animFrame+=1;
            this.activeSprite=sprite_base.ruby[this._animFrame];
         
        }
        else if(power_is_crystal){
            var sprite_base=this.sprite;
            if(this._animFrame>=6){
                this._animFrame=0;
            }
            this._animFrame+=1;
             this.activeSprite=sprite_base.crystal[this._animFrame];
       }
       else if(power_is_coin){
           var sprite_base=this.sprite;
           if(this._animFrame>=3){
               this._animFrame=0;
               this.activeSprite=sprite_base.coin[this._animFrame];
           }
           this._animFrame+=1;
           this.activeSprite=sprite_base.coin[this._animFrame];
       }
       else if(power_is_skull){
    
           var sprite_base=this.sprite;
          this.activeSprite=sprite_base.skull[0];
        }
     
     }
    else {
        return;}
};


Power.prototype.render = function (ctx) {

    //this.sprite.drawWrappedCentredAt(ctx, this.cx, this.cy, 0);
    
   // var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;
    this.activeSprite.drawCentredAt(ctx, this.cx, this.cy,0);
    
};

Power.prototype.getID = function() {
    return this.powerID;
}
Power.prototype.checkForKill = function(){
    if(this.cy>650){
        powerSprite_is_alive=false;
        power_is_ruby=false;
        power_is_skull=false;
        power_is_crystal=false;
        power_is_coin=false;
        this.kill();
    }

};