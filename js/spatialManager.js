/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {

    // TODO: YOUR STUFF HERE!
    return this._nextSpatialID++;
    

},

register: function(entity) {
    var spatialID = entity.getSpatialID();
    var pos = entity.getPos();

    
    // TODO: YOUR STUFF HERE!
    this._entities.push(entity);

},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    // TODO: YOUR STUFF HERE!
    for (var c = 0; c < this._entities.length; c++) {
        var e = this._entities[c];
        if (e instanceof Entity) {
            if (e.getSpatialID() == entity.getSpatialID()) {
                delete this._entities[c];
                break;
            }
        }
    }

},

findEntityInRange: function(posX, posY, radius) {
    for (var c = 0; c < this._entities.length; c++) {
        var e = this._entities[c];
        if (e) {

            var entPos = e.getPos();
            var dist = util.distSq(entPos.posX, entPos.posY, posX, posY);
            var rad = util.square(e.getRadius() + radius);

            if (dist < rad) {
                return e;
            }
        }
    }
    return false;

},

render: function(ctx) {
    ctx.save();
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    //Added the spatial Id to the debugging
    ctx.font="20px Verdana";
    ctx.fillStyle="red";
    for (var ID in this._entities) {
        var e = this._entities[ID];
        var pos = e.getPos();

        ctx.fillText(e.getSpatialID(),pos.posX,pos.posY);
        util.strokeCircle(ctx, pos.posX, pos.posY, e.getRadius());
    }
    ctx.strokeStyle = oldStyle;
    ctx.restore();
}

}
