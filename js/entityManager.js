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

_generatePlatform : function() {

    //Pseudo code for +certain numerofPlatforms
    //if numofplatforms=<100 use this:
    var base_cy = 600;
    var base_cx = 1;

    var numPlatforms = g_canvas.height;
    var platformCount = 0;

    for (var i = 0; i < g_canvas.height; i++) {
        base_cy -=50;
        base_cx = Math.floor(Math.random()*(g_canvas.width-Platform.prototype.platWidth)) + 0;
        platformCount +=1;
        this.generatePlatform({
            cx: base_cx,
            cy: base_cy
        });
    }

    //if num of platforms>100 use this: 
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
    this._generatePlatform();
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

            var status = aCategory[i].update(du);
            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }
    
    //Some function to generate new platform when the time is right
    /*
        if ( something ) this._generatePlatform();
    */

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

