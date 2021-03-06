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
_flame: [],
_flameChar:[],
_Effects:[],
_power: [],
_Notifications:[],
_clock: [],
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
    var INITIAL_PLATFORMS = 12;
    for (var i = 1; i<INITIAL_PLATFORMS; i++) {
        this.generatePlatform();
    }
},

/*
    This function generates a flame
*/
generateFlame: function(cx, cy, velX, velY, gravity, rotation) {
    this._flame.push(new Flame({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,
        ag   : gravity,
        rotation : rotation
    }));;
},

/*
    Generates a notification
*/
generateNotification: function(type,scale){
    if(scale === undefined) scale = 1;
    this._Notifications.push(new Notification(type,scale));
},

/*
    Generates the clock
*/
generateClock: function(descr) {
    this._clock[0]=new Clock(descr);
},

/*
    deferredSetup that desides in which order things
    are drawn and updated
*/
deferredSetup : function () {
    this._categories = [
        this._platforms,
        this._characters,
        this._Walls,
        this._flame,
        this._flameChar,
        this._Effects,
        this._power,
        this._Notifications,
        this._clock
    ];
},

/*
    Generates a platform in the correct place
*/
generatePlatform : function(descr) {
    g_TOP_FLOOR = new Platform(descr);
    var rand = util.randRange(0,10);
    if(rand < 1) entityManager.generatePower();
    this._platforms.push(g_TOP_FLOOR);
},

/*
    Generates a powerup
*/
generatePower : function(descr) {
    this._power.push(new Power(descr));
},
/*
    Powerup functions, should maybe rather be
    implemented elsewhere
*/
/*
    Changes the gravity
*/
turnOffGravity: function(){
    this._characters[0].speedPowerup = 0;
    var timer = 30*NOMINAL_UPDATE_INTERVAL;
    this._characters[0].gravityPowerup = timer;
},
/*
    Speeds up the game
*/
speedUp: function(){
    this.generateEffect(this._characters[0].cx,this._characters[0].cy,"FIREBLAST");
    this._characters[0].gravityPowerup =0;
    var timer = 30*NOMINAL_UPDATE_INTERVAL;
    this._characters[0].speedPowerup = timer;
},

reaper: function(){
    this.generateEffect(this._characters[0].cx,this._characters[0].cy,"SPLATTER");
    this._characters[0].currPlatform=false;
    this._characters[0]._jumping=true;
    this._characters[0].velY += 10;
},

//Make platforms smaller
smaller: function(){

    var length = this._platforms.length;
    SCALE_ONE = 1;
    SCALE_TWO = 1;
    for (var i=0; i<length; i++) {
        this._platforms[i].shouldPowerScale = true;
        this._platforms[i].scaleOne = SCALE_ONE;
        this._platforms[i].scaleTwo = SCALE_TWO;
        this._platforms[i].platScale();
    }
},

//Make platforms bigger
bigger: function(){
    var length = this._platforms.length;
    SCALE_ONE = 4;
    SCALE_TWO = 4;
    for (var i=0; i<length; i++) {
        var xPos = this._platforms[i].cx;
        var yPos = this._platforms[i].cy;
        this._platforms[i].shouldPowerScale = true;
        this._platforms[i].scaleOne = SCALE_ONE;
        this._platforms[i].scaleTwo = SCALE_TWO;
        this._platforms[i].platScale();
        this._platforms[i].platPosition();

        /*
        var platWidth = this._platforms[i].platWidth;
        var interval = platWidth/2;
        var influence = 0;
        for (var j=0; j<3; j++) {
            influence += interval;
            this.generateEffect(xPos+influence,yPos,"FIREBLAST");
            this.generateEffect(xPos-influence,yPos,"FIREBLAST");
        }
        */
    }
},

/*
    Increase the jump height of the character
*/
increaseJumpHeight:function(jumpInfluence){
    this._characters[0].jumpInfluence += jumpInfluence;
},
/*
    Generate the character
*/
generateCharacter : function(descr) {
    this._characters.push(new Character(descr));
},
/*
    Generate the walls
*/
generateWalls : function(descr) {
    this._Walls.push(new Wall(descr));
},
/*
    Generate an effect
*/
generateEffect: function(cx,cy,type){
    this._Effects.push(new Effect(cx,cy,type));
},
/*
    initialised setup
*/
init: function() {
    
    //Reset things
    this.resetCharacters();
    this.resetWalls();
    this.resetPlatforms();
    this.killEffects();
    this.killPowerups();
    this.killCharacter();
    this.killNotifications();
    //Generate the inital plaforms
    this._generateInitialPlatforms();
    //Generate the clock
    this.generateClock();
    //Generate the walls
    this.generateWalls();
    this.generateCharacter();
    this.generateNotification("GO",0.5);
},


/*
    Kill all the powerups
*/
killPowerups: function(){
    var c = this._power.length-1;
    while (c >= 0) {
        this._power.splice(0, 1);
        --c;
    }
},
/*
    Kill all the Effects
*/
killEffects: function(){
    var c = this._Effects.length-1;
    while (c >= 0) {
        this._Effects.splice(0, 1);
        --c;
    }
},
/*
    Kill all the Platforms
*/
killPlatforms: function () {
    var c = this._platforms.length-1;
    while (c >= 0) {
        spatialManager.unregister(this._platforms[c]);
        this._platforms.splice(0, 1);
        --c;
    }
},

/*
    Kill all the notifications
*/
killNotifications: function () {
    var c = this._Notifications.length-1;
    while (c >= 0) {
        this._Notifications.splice(0, 1);
        --c;
    }
},
/*
    Kill the character
*/
killCharacter: function () {
    var c = this._characters.length-1;
    while (c >= 0) {
        spatialManager.unregister(this._characters[c]);
        this._characters.splice(0, 1);
        --c;
    }
    
},
/*
    Functions that reset things
*/
resetCharacters: function() {
    this._forEachOf(this._characters, Character.prototype.reset);
},
resetPlatforms: function() {
    Platform.prototype.reset();
},

resetWalls: function() {
    this._forEachOf(this._Walls, Wall.prototype.reset);
},
/*
    Functions that halt things
*/
haltCharacters: function() {
    this._forEachOf(this._characters, Character.prototype.halt);
},	
haltWalls: function() {
    this._forEachOf(this._Walls, Wall.prototype.halt);
},
haltPlatforms: function() {
    this._forEachOf(this._platforms, Platform.prototype.halt);
},
/*
    Function that toogles if the platforms are shown
*/
togglePlatforms: function() {
    this._bShowPlatforms = !this._bShowPlatforms;
},

/*
    This function updates all the entities
*/
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
                //Force the game heigh to never go below 0
                if(g_GAME_HEIGHT <0) {
                    g_GAME_HEIGHT = 0;
                }
                if (!(cat instanceof Notification) && !(cat instanceof Clock)) {
                    //Move the screen if it should be moving
                    cat.setPos(pos.posX,pos.posY+g_MOVE_SCREEN*du);
                }
                ++i;
            }
        }
    }
    //Increase the game height
    g_GAME_HEIGHT += g_MOVE_SCREEN*du;
    if (g_GAME_HEIGHT> g_GAME_TOP_HEIGHT){ 
        g_GAME_TOP_HEIGHT = g_GAME_HEIGHT;
    }
},

/*
    This function renders all the entities
*/
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

