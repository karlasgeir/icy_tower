"use strict";
/* jshint browser: true, devel: true, globalstrict: true */
function Score() {
    this.score = 0;
    this.comboMultiplier= 1;
    this.topDist = 10;
    this.rightDist = 10;
    this.distbetween = 5;
    this.scale = 1;
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
    var cx = g_canvas.width - this.rightDist - spritescore.length*g_sprites.numbers[0].width;
    var cy = this.cy;
    console.log(this.score,cx,cy);
    var distbetween = this.distbetween;
    spritescore.forEach(function(number){
        number.drawCentredAt(ctx,cx,cy);
        cx += number.width + distbetween
    });
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