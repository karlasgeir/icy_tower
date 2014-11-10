/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/

var entityManager = {

// "PRIVATE" DATA
_characters: [],
_platforms: [],
_bShowPlatforms: true,
base_cy: 0,
base_cx: 0,

// "PRIVATE" METHODS


_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//

_generateInitialPlatforms : function() {
    
    var numOfPlatforms = 12;
    Platform.prototype.numberOfPlatforms = 12;

    for (var i = 0; i<numOfPlatforms; i++) {
        this.base_cx = Math.floor(Math.random()*(g_canvas.width-Platform.prototype.platWidth)) + 0;
        this.generatePlatform({
            cx: this.base_cx,
            cy: this.base_cy
        });
        this.base_cy +=50;
    }
    this.base_cy = 0;

},

deferredSetup : function () {
    this._categories = [this._characters, this._platforms];
},

generatePlatform : function(descr) {
    this._platforms.push(new Platform(descr));
},

generateCharacter : function(descr) {
    this._characters.push(new Character(descr));
},

init: function() {
    this._generateInitialPlatforms();
    //this._generateShip();
},


resetCharacters: function() {
    this._forEachOf(this._characters, Character.prototype.reset);
},

haltCharacters: function() {
    this._forEachOf(this._characters, Character.prototype.halt);
},	

togglePlatforms: function() {
    this._bShowPlatforms = !this._bShowPlatforms;
},

update: function(du) {

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {
            var cat = aCategory[i];
            var status = cat.update(du);
            if (status === this.KILL_ME_NOW) {
                NUMBER_OF_PLATFORMS +=1;
                var count = NUMBER_OF_PLATFORMS;
                console.log(count);
                this.base_cx = Math.floor(Math.random()*(g_canvas.width-Platform.prototype.platWidth)) + 0;

                if (count>0 && count <=100) {
                    this.generatePlatform({
                        cx: this.base_cx,
                        cy: this.base_cy
                    });
                }

                if (count>100) {
                    this.generatePlatform({
                        cx: this.base_cx,
                        cy: this.base_cy

                        //Virkar ekki, þarf að gefa hinum þennan nýja hraða líka
                        //verticalSpeed: 0.5
                    });
                }
                aCategory.splice(i,1);
                //console.log(Platform.prototype.verticalSpeed);
            }
            else {
                var pos = cat.getPos();
                cat.setPos(pos.posX,pos.posY+g_MOVE_SCREEN);
                ++i;
            }
        }
    }
    //console.log(this.base_cy);
    //console.log(entityManager._platforms);
},

render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        if (!this._bShowPlatforms && 
            aCategory == this._platforms)
            continue;

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

