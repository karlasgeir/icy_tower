// ===============
// Platform STUFF
// ===============
"use strict";
/* jshint browser: true, devel: true, globalstrict: true */
// A generic contructor which accepts an arbitrary descriptor object

function Platform(descr) {

	this.setup(descr);
    this.sprite = g_sprites.testplat;
    this.platHeight = this.sprite.height;
    this.platWidth = this.sprite.width;
    this.halfWidth = this.platWidth/2;
    this.halfHeight = this.platHeight/2;

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
    console.log(this.scale*this.platWidth/2);

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
    }

    if (entityManager._platforms.length<8) {
        entityManager.makeNewPlatform();
    }

    this.reset(ctx);
  
    this.cy +=this.verticalSpeed*du;

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


