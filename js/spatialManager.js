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
    this._nextSpatialID +=1;
    return this._nextSpatialID-1;
    

},

register: function(entity) {
    var spatialID = entity.getSpatialID();

    
    // TODO: YOUR STUFF HERE!
    this._entities.push(entity);

},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    // TODO: YOUR STUFF HERE!
    for(var i in this._entities){
        if(this._entities.hasOwnProperty(i)){
            var e = this._entities[i];
            if(e.getSpatialID() === spatialID){
                this._entities.splice(i,1);
            }
        }
    }

},

findEntityInRange: function(posX, posY, radius) {
    for (var entity in this._entities) {
        var e = this._entities[entity];
        var pos=e.getPos();
        var distance = Math.sqrt(util.distSq(posX,posY,pos.posX,pos.posY));
        var limit  = radius + e.getRadius();
        if(distance < limit){
            return e;
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
