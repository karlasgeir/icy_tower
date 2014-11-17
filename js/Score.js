"use strict";
/* jshint browser: true, devel: true, globalstrict: true */
function Score() {
    this.score = 0;
    this.comboMultiplier= 1;
    this.topDist = 10;
    this.rightDist = 10;
    this.distbetween = 1;
    this.scale = 0.7;
    this.sprite = g_sprites.numbers;
    this.cy = this.sprite[0].height/2 + this.topDist;
};


Score.prototype.addToScore = function(score){
    this.score += score;
};

Score.prototype.getScore = function(){
    return this.score;
}

Score.prototype.getComboMultiplier = function(){
    return this.comboMultiplier;
}
Score.prototype.setComboMultiplier = function(combo){
    this.comboMultiplier = combo;
}


Score.prototype.render = function(ctx){
    var spritescore = this.createSpriteScore();
    var cx = g_canvas.width - this.rightDist - this.getWidth();
    this.draw(ctx,cx,this.cy,this.distbetween,spritescore,this.scale);
}

Score.prototype.createSpriteScore = function(){
    var scoreArray = (""+this.score).split('');
    var spriteArray = [];
    var sprite = this.sprite;
    scoreArray.forEach(function(int){
        spriteArray.push(sprite[int]);
    });
    return spriteArray;
}

Score.prototype.renderFinalScore = function(ctx,x,cy){
    var cx = x+this.sprite[0].width/2;
    this.draw(ctx,cx,cy,this.distbetween,this.createSpriteScore());
}

Score.prototype.draw = function(ctx,cx,cy,distbetween,sprites,scale){
    if(scale === undefined) scale = 1;
    sprites.forEach(function(number){
        var oldscale = number.scale;
        number.scale = scale;
        number.drawCentredAt(ctx,cx,cy);
        number.scale = oldscale;
        cx += number.width + distbetween
    });
}

Score.prototype.getWidth = function(){
    var scoreArray = (""+this.score).split('');
    var sprite = this.sprite;
    var width = 0;
    scoreArray.forEach(function(int){
        width += sprite[int].width;
    });
    return width + this.distbetween*(scoreArray.length);
}