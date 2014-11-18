"use strict";
//Construct a new explotion
function Explotion(cx,cy) {
    this.sprite = g_sprites.explotion;
    this.activeSprite = this.sprite[0];
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

Explotion.prototype = new Entity();

Explotion.prototype.render = function(ctx){
    if(this.shouldDraw) this.sprite[this.animFrame].drawCentredAt(ctx,this.cx,this.cy);
};

Explotion.prototype.update = function(du){
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

Explotion.prototype.changeSprite = function(){
    if(this.animFrame < g_sprites.explotion.length-1){
        this.animFrame += 7;
    }
    else {
        this.shouldDraw = false;
        this.kill();
    }
}

