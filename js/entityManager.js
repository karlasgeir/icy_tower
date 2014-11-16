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
_Walls: [],
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
_generateInitialPlatforms : function() {
    var INITIAL_PLATFORMS = 9;
    console.log("GENERATING PLATFORMS");
    for (var i = 0; i<INITIAL_PLATFORMS; i++) {
        this.generatePlatform();
    }
},

_generateWall : function() {
      
    this.generateWalls({
        cx: 0,
        cy: 0
    });
},

deferredSetup : function () {
    this._categories = [this._platforms,this._characters,this._Walls];
},

generatePlatform : function(descr) {
    this._platforms.push(new Platform(descr));
},

generateCharacter : function(descr) {
    this._characters.push(new Character(descr));
},
generateWalls : function(descr) {
    this._Walls.push(new Wall(descr));
},

init: function() {
    this._generateInitialPlatforms();
    //this._generateShip();
    this._generateWall();
},

killPlatforms: function () {
    var c = 0;
    while (c < this._platforms.length) {
        spatialManager.unregister(this._platforms[c]);
        this._platforms.splice(c, 1);
        ++c;
    }
},
resetCharacters: function() {
    this._forEachOf(this._characters, Character.prototype.reset);
},

resetWalls: function() {
    this._forEachOf(this._Walls, Wall.prototype.reset);
},

haltCharacters: function() {
    this._forEachOf(this._characters, Character.prototype.halt);
},	
haltWalls: function() {
    this._forEachOf(this._Walls, Wall.prototype.halt);
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
            var pos = cat.getPos();

            if (status === this.KILL_ME_NOW) {
                aCategory.splice(i,1);
            }
            else {
                if(g_GAME_HEIGHT <0) {
                    g_GAME_HEIGHT = 0;
                }
                cat.setPos(pos.posX,pos.posY+g_MOVE_SCREEN*du);
                ++i;
            }
        }
        
    }
    //Hækkum game height
    g_GAME_HEIGHT += g_MOVE_SCREEN*du;
    if (g_GAME_HEIGHT> g_GAME_TOP_HEIGHT){ 
        g_GAME_TOP_HEIGHT = g_GAME_HEIGHT;
    }
    if(g_GAME_HEIGHT !== 0){
        console.log(g_TOP_FLOOR);
        g_TOP_FLOOR += (g_MOVE_SCREEN + Platform.prototype.verticalSpeed)*du;
    }
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

