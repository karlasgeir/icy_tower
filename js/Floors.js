// ===============
// Platform STUFF
// ===============
"use strict";
/* jshint browser: true, devel: true, globalstrict: true */
// A generic contructor which accepts an arbitrary descriptor object
var SPACE_BETWEEN_PLATFORMS = 80;
function Platform(descr) {
    g_NUMBER_OF_PLATFORMS += 1;
	this.setup(descr);
    this.sprite = g_sprites.testplat;
    this.platHeight = this.sprite.height;
    this.platWidth = this.sprite.width;
    this.halfWidth = this.platWidth/2;
    this.halfHeight = this.platHeight/2;
    //TODO: change from magic number
    this.cy = g_TOP_FLOOR -= SPACE_BETWEEN_PLATFORMS;
    this.scale  = this.scale  || 1;

    this.platScale();
    this.platPosition();
};

Platform.prototype = new Entity();
Platform.prototype.cx = 0;
Platform.prototype.cy = 0;
Platform.prototype.margin = 80;
Platform.prototype.verticalSpeed = 0.5;

Platform.prototype.platPosition = function() {

    var leftSide = g_sprites.wallsprite.width/2;
    var rightSide = g_canvas.width - leftSide;

    this.cx = util.randRange(leftSide  + this.scale*this.platWidth/2,rightSide - this.scale*this.platWidth/2);
};

Platform.prototype.platScale = function () {
    this.scale = util.randRange(2,3);
};

Platform.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
	this.sprite.drawCentredAtScaleWidth(ctx, this.cx, this.cy, 0);
};



Platform.prototype.update = function (du) {

	spatialManager.unregister(this);

	if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    this.gameHeight = g_canvas.height - this.cy + this.platHeight/2 + g_GAME_HEIGHT;

    if (this.cy>g_canvas.height+this.platHeight) {
    	this.kill();
        //this.cy = -20;
        entityManager.generatePlatform();
    }
    this.reset(ctx);
    if(g_GAME_HEIGHT > 0)
    { 
        this.cy += this.verticalSpeed*du;
    }

    if(gameOver){
       return; 
    }   

    spatialManager.register(this);

};

Platform.prototype.reset = function (ctx) {
    if (gameOver && g_menu.gameStarted) {
        entityManager.killPlatforms();
    }
    if (!gameOver) {
        return;
    }
}


