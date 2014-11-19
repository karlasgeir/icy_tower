// ======
// ENTITY
// ======
/*

Provides a set of common functions which can be "inherited" by all other
game Entities.

JavaScript's prototype-based inheritance system is unusual, and requires 
some care in use. In particular, this "base" should only provide shared
functions... shared data properties are potentially quite confusing.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


function Entity() {

/*
    // Diagnostics to check inheritance stuff
    this._entityProperty = true;
    console.dir(this);
*/

};

Entity.prototype.setup = function (descr) {

    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
    
    // Get my (unique) spatial ID
    this._spatialID = spatialManager.getNewSpatialID();

    //Initialise gameHeight
    this.gameHeight = 0;
    
    // I am not dead yet!
    this._isDeadNow = false;
};

/*
    This function sets the position
    of this entity
*/
Entity.prototype.setPos = function (cx, cy) {
    this.cx = cx;
    this.cy = cy;
};

/*
    This function gets the position of
    this entity
*/
Entity.prototype.getPos = function () {
    return {posX : this.cx, posY : this.cy};
};
/*
    This function returns the radius
    of this entity
*/
Entity.prototype.getRadius = function () {
    return 0;
};
/*
    This function returns the size
    of this entity.
    The size is an object: {width:, height:}
*/
Entity.prototype.getSize = function(){
    if(this instanceof Character){
        return{width: this.getWidth(), height: this.getHeight()};
    }
    else if(this instanceof Platform){
        return {width: this.platWidth*this.scale, height:this.platHeight};
    }
    else if(this instanceof Wall){
        return {width: this.wallWidth, height:this.wallHeight};
    }
};

/*
    This function returns the rotation of
    this entity
*/
Entity.prototype.getRotation = function(){
    return this.rotation;
};

/*
    This function returns the spatial ID
    for this entity
*/
Entity.prototype.getSpatialID = function () {
    return this._spatialID;
};

/*
    This function returns the game height
    for this entity. (The height it has
    traveled from the ground in the game)
*/
Entity.prototype.getGameHeight = function(){
    return this.gameHeight;
}


/*
    This function tells the entitity that
    it's dead
*/
Entity.prototype.kill = function () {
    this._isDeadNow = true;
};

/*
    This function finds the entity it's
    colliding with, if it's colliding with
    any
*/
Entity.prototype.findHitEntity = function () {
    var pos = this.getPos();
    var size = this.getSize();
    return spatialManager.findEntityInRange(
        pos.posX, pos.posY, size.width,size.height, this.gameHeight
    );
};

// This is just little "convenience wrapper"
Entity.prototype.isColliding = function () {
    return this.findHitEntity();
};

/*
    This function wraps the position of
    this entity so it doesn't go outside
    the canvas (unless we want it to)
*/
Entity.prototype.wrapPosition = function () {
    this.cx = util.clampRange(this.cx, g_left_side + this.activeSprite.width/2, g_right_side-this.activeSprite.width/2);
    //We want the character to be able to drop below the canvas if he's not at the bottom
    if(g_GAME_HEIGHT === 0){
        this.cy = util.clampRange(this.cy, this.activeSprite.height/2, g_canvas.height-this.activeSprite.height/2);
    }
};