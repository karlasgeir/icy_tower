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

    this._nextSpatialID +=1;
    return this._nextSpatialID-1;
},

register: function(entity) {
    var spatialID = entity.getSpatialID();

    
    this._entities.push(entity);

},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    for(var i in this._entities){
        if(this._entities.hasOwnProperty(i)){
            var e = this._entities[i];
            if(e.getSpatialID() === spatialID){
                this._entities.splice(i,1);
            }
        }
    }

},

findEntityInRange: function(posX, posY, width,height, gameHeight) {
    for (var entity in this._entities) {
        var e = this._entities[entity];
        var pos=e.getPos();
        var size = e.getSize();
        if(e instanceof Power){
            if(posX < pos.posX + size.width
                && posX + width > pos.posX
                && posY < pos.posY + size.height
                && height + posY > pos.posY){
                return e;
            }
            
        }
        else if(e instanceof Platform){
            if(util.isBetween(gameHeight,e.getGameHeight()-9,e.getGameHeight()+15)){

                if(posX - width/2 < pos.posX+size.width/2
                        && posX + width/2 > pos.posX - size.width/2){
                    return e;
                }
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
    ctx.textBaseline="middle";
    for (var ID in this._entities) {
        var e = this._entities[ID];
        var pos = e.getPos();
        var size = e.getSize();
        ctx.fillText(e.getSpatialID(),pos.posX,pos.posY);
        
        if(e instanceof Character){
            util.strokeCenteredBox(ctx,pos.posX-size.width/2,pos.posY-size.height/2,size.width,size.height,this.rotation);
        }
        else if(e instanceof Platform || e instanceof Power){
            console.log(e,size);
            util.strokeCenteredBox(ctx, pos.posX-size.width/2, pos.posY-size.height/2, size.width,size.height,0);
        }
       
        
        
    }
    ctx.strokeStyle = oldStyle;
    ctx.restore();
}

}
