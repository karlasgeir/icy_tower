// ===============
// Platform STUFF
// ===============
"use strict";
/* jshint browser: true, devel: true, globalstrict: true */
// Platform constructor that creates a new platform in the
// correct place
var SPACE_BETWEEN_PLATFORMS = 80;
var NOMINAL_VERTICAL_SPEED = 0.5;
function Platform(descr) {
    /*
        Initial settings that can be overwritten
    */
    this.sprite = g_sprites.platform;
    this.activeSprite = this.sprite.normal.whole;
    this.signSprite = this.sprite.sign;
    this.platHeight = this.activeSprite.height;
    this.platWidth = this.activeSprite.width;
    this.scale  = this.scale  || 1;
    this.id = g_NUMBER_OF_PLATFORMS+1;

    //Setup from descr (can override the above)
    this.setup(descr);

    //Generate the plaform
    this.platScale();
    this.platPosition();
    this.halfWidth = this.platWidth/2;
    this.halfHeight = this.platHeight/2;

    g_NUMBER_OF_PLATFORMS += 1;                 //Increment the number of platforms
    this.cy = g_TOP_FLOOR -= SPACE_BETWEEN_PLATFORMS;
};
//Create entity
Platform.prototype = new Entity();
//Initial settings that can be overwritten
Platform.prototype.cx = 0;
Platform.prototype.cy = 0;
Platform.prototype.margin = SPACE_BETWEEN_PLATFORMS;
Platform.prototype.verticalSpeed = NOMINAL_VERTICAL_SPEED;

/*
    This function desides the x position of the platform
*/
Platform.prototype.platPosition = function() {

    var leftSide = g_sprites.wallsprite.width/2;
    var rightSide = g_canvas.width - leftSide;

    this.cx = util.randRange(leftSide  + this.scale*this.platWidth/2,rightSide - this.scale*this.platWidth/2);
};

/*
    This function desides the scale of the platform
*/
Platform.prototype.platScale = function () {
    this.scale = util.randRange(2,3);
};

/*
    This function renders the platform
*/
Platform.prototype.render = function (ctx) {
    //sace the original scale
    var origScale = this.activeSprite.scale;
    // pass my scale into the sprite, for drawing
    this.activeSprite.scale = this.scale;
    // draw the sprite
	this.activeSprite.drawCentredAtScaleWidth(ctx, this.cx, this.cy);
    //reset the scale
    this.sprite.scale = origScale;

    if(this.id % 10 === 0 && this.id > 1){
        this.signSprite.drawCentredAt(ctx,this.cx,this.cy);
        ctx.save();
        ctx.font = "15px Georiga bold";
        ctx.fillStyle = "#A4E2FF";
        ctx.textBaseline = "middle";
        ctx.textAlign="center";
        ctx.fillText(this.id,this.cx,this.cy);
        ctx.restore();
    }
};

/*
    This function updates the platform
*/
Platform.prototype.update = function (du) {
    //Unregister from spatial manager
	spatialManager.unregister(this);

    //Check for death
	if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    //Update game height
    this.gameHeight = g_canvas.height - this.cy + this.platHeight/2 + g_GAME_HEIGHT;

    //Where the platform is killed (want it to be able to go a bit under the canvas)
    var PLATFORM_KILL_LIMIT = g_canvas.height + this.platHeight + 200;
    //Check if it goes under the PLATFORM_KILL_LIMIT
    if (this.cy>PLATFORM_KILL_LIMIT) {
        //Kill it
    	this.kill();
        entityManager.generatePlatform();
    }    
    //If the screen has been moved once
    if(g_GAME_HEIGHT > 0)
    { 
        //Begin scrolling
        this.cy += this.verticalSpeed*du;
    }

    //If game is over
    if(!gameOver){
         spatialManager.register(this);
    }
};

Platform.prototype.reset = function () {
    entityManager.killPlatforms();
    g_NUMBER_OF_PLATFORMS = 0;
    g_TOP_FLOOR = g_canvas.height;
}


