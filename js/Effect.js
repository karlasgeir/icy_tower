"use strict";
/*
    Effect constructor
    Takes in cx,cy and type
    Creates an effect in cx,cy of a specified type
*/
function Effect(cx,cy,type) {
    //The sprites
    this.sprite = g_sprites.effects;
    //Determine type of effect
    switch(type){
        case "EXPLOTION":
            this.activeSprite = this.sprite.explotion;
            break;
        case "FLASH":
            this.activeSprite = this.sprite.flash;
            break;
        case "FIREBLAST":
            this.activeSprite = this.sprite.fireBlast;
            break;
    }
    //Initialise values
    this.type = type;
    this.width = this.sprite.width;
    this.height = this.sprite.height;
    this.cx = cx;
    this.cy = cy;
    this.scale = 1;
    this.animFrame = 0;
    this.animTicker = 0;
    this.animTickRate = 1;
    this.shouldDraw=true;
};

//Create entity
Effect.prototype = new Entity();
/*
    Render the effect
*/
Effect.prototype.render = function(ctx){
    //Rendering for flash
    if(this.type === "FLASH"){
        var wallWidth = entityManager._Walls[0].wallWidth;
        //Right side
        if(this.cx <= wallWidth){
            this.activeSprite[this.animFrame].drawCentredAt(ctx,this.cx,this.cy);
        }
        //Left side
        else{
            this.activeSprite[this.animFrame].drawCentredAt(ctx,this.cx,this.cy,Math.PI);
        }
    }
    //Rendering for fireblast
    else if(this.type === "FIREBLAST" || this.type ==="EXPLOTION") {
        this.activeSprite[this.animFrame].drawCentredAt(ctx,this.cx,this.cy);
    }
};

/*
    Updates the effects
*/
Effect.prototype.update = function(du){
    //Check for death
    if(this._isDeadNow){return entityManager.KILL_ME_NOW;}
    //Desides when to change sprites
    if(this.animTicker < this.animTickRate){
        this.animTicker += du;
    }
    else {
        this.changeSprite();
        this.animTicker = 0;
    }
}

/*
    Changes sprite
*/
Effect.prototype.changeSprite = function(){
    if(this.animFrame < this.activeSprite.length-1){
        if(this.type === "EXPLOTION"){
            this.animFrame += 7;
        }
        else this.animFrame +=1;
    }
    else {
        this.kill();
    }
}

