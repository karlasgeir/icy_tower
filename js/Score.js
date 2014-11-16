"use strict";
/* jshint browser: true, devel: true, globalstrict: true */
function Score() {
    this.score = 0;
    this.comboMultiplier= 1;
    
    /*
        this.cx = g_canvas.width;
        this.cy = g_canvas.height/2;
    */
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