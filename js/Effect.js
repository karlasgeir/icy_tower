"use strict";
//Construct a new explotion
function Effect(cx,cy,type) {
    this.sprite = g_sprites.effects;
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

Effect.prototype = new Entity();

Effect.prototype.render = function(ctx){

    

    if(this.shouldDraw){
        if(this.type === "FLASH"){
            var wallWidth = entityManager._Walls[0].wallWidth;
            if(this.cx <= wallWidth){
                this.activeSprite[this.animFrame].drawCentredAt(ctx,this.cx,this.cy);
            }
            else{
                this.activeSprite[this.animFrame].drawCentredAt(ctx,this.cx,this.cy,Math.PI);
            }       
        } 
        else if(this.type === "EXPLOTION") {
            this.activeSprite[this.animFrame].drawCentredAt(ctx,this.cx,this.cy);
        }
    }
};

Effect.prototype.update = function(du){
    //Check for death
    if(this._isDeadNow){return entityManager.KILL_ME_NOW;}
    if(this.animTicker < this.animTickRate){
        this.animTicker += du;
    }
    else {
        this.changeSprite();
        this.animTicker = 0;
    }
}

Effect.prototype.changeSprite = function(){
    if(this.animFrame < this.activeSprite.length-1){
        if(this.type === "EXPLOTION"){
            this.animFrame += 7;
        }
        else this.animFrame +=1;
    }
    else {
        this.shouldDraw = false;
        this.kill();
    }
}

