"use strict";
/* jshint browser: true, devel: true, globalstrict: true */

/*
    Handles the score
*/
function Score() {
    //Initial values
    this.score = 0;
    this.comboMultiplier= 1;
    this.topDist = 10;
    this.rightDist = 10;
    this.distbetween = 1;
    this.scale = 0.7;
    this.sprite = g_sprites.numbers;
    this.cy = this.sprite[0].height/2 + this.topDist;
};

/*
    Adds to the score
*/
Score.prototype.addToScore = function(score){
    this.score += Math.round(score*g_SCORE_MULTIPLIER);
};

/*
    A function to get the score
*/
Score.prototype.getScore = function(){
    return this.score;
};

/*
    A function to render the score
*/
Score.prototype.render = function(ctx){
    //Creates the score in sprites
    var spritescore = this.createSpriteScore();
    //Determine the position based on the size of the score
    var cx = g_canvas.width - this.rightDist - this.getWidth();
    //Draw the score
    this.draw(ctx,cx,this.cy,this.distbetween,spritescore,this.scale);

    //If the combos have caused a multiplier
    if(g_SCORE_MULTIPLIER > 1){
        //Draw it on the screen
        ctx.save();
        ctx.fillStyle="#FFCC00";
        ctx.font = "bold 20px Symbol";
        ctx.textAlign = 'center';
        ctx.textBaseline = "middle";
        ctx.fillText("COMBO!", g_sprites.wallsprite.width/4,g_sprites.clock.height+20);
        ctx.fillText("X " + g_SCORE_MULTIPLIER, g_sprites.wallsprite.width/4,g_sprites.clock.height + 40);

        ctx.restore();
    }
};

/*
    This function creates the score with sprites
*/
Score.prototype.createSpriteScore = function(){
    //Split up the score into single numbers
    var scoreArray = (""+this.score).split('');
    var spriteArray = [];
    var sprite = this.sprite;
    //Go through the numbers and apply a sprite to each of them
    scoreArray.forEach(function(int){
        spriteArray.push(sprite[int]);
    });
    //Return the array of number sprites
    return spriteArray;
};

/*
    Function to render the final score on the game over screen
*/
Score.prototype.renderFinalScore = function(ctx,x,cy){
    //Determine the position
    var cx = x+this.sprite[0].width/2;
    this.draw(ctx,cx,cy,this.distbetween,this.createSpriteScore());
};

/*
    A function to draw the scores
*/
Score.prototype.draw = function(ctx,cx,cy,distbetween,sprites,scale){
    if(scale === undefined) scale = 1;
    //Go throught each sprite number and draw it
    sprites.forEach(function(number){
        var oldscale = number.scale;
        number.scale = scale;
        //Draw sprite number
        number.drawCentredAt(ctx,cx,cy);
        number.scale = oldscale;
        //add space between
        cx += number.width + distbetween
    });
};

/*
    Find how vide the score is going to be
    when it's drawn
*/
Score.prototype.getWidth = function(){
    var scoreArray = (""+this.score).split('');
    var sprite = this.sprite;
    var width = 0;
    scoreArray.forEach(function(int){
        width += sprite[int].width;
    });
    return width + this.distbetween*(scoreArray.length);
};