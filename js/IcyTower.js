// =========
// IcyTower
// =========
/*
We need:
Character.js
Platform.js
*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIPS
// ====================
function createInitialCharacter() {
    entityManager.generateCharacter({
        cx :200,
        cy :g_canvas.height,
        _scale:5
    });
    
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    processDiagnostics();
    
    entityManager.update(du);

}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = true;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_MIXED   = keyCode('M');;
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_HALT)) entityManager.haltShips();

    if (eatKey(KEY_RESET)) entityManager.resetShips();

}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        character   : "res/spritesheet.png",
        character_rev  : "res/spritesheet-rev.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {

    //Loading all the sprite
    
    g_sprites.character = {
        idle:{
            0: new Sprite(g_images.character,30,52,50,162),
            1: new Sprite(g_images.character,30,52,562,36),
            2: new Sprite(g_images.character,30,52,434,37)
        },
        walk:{
            0: new Sprite(g_images.character,27,52,180,288),
            1: new Sprite(g_images.character,29,52,308,289),
            2: new Sprite(g_images.character,29,52,436,289),
            3: new Sprite(g_images.character,28,52,562,287)
        },
        jump:{
            0:new Sprite(g_images.character,30,52,178,163),
            1: new Sprite(g_images.character,30,52,306,162),
            2: new Sprite(g_images.character,30,52,433,163),
            3: new Sprite(g_images.character,30,57,561,161)
        },
        chock: new Sprite(g_images.character,30,52,50,36),
        rotate: new Sprite(g_images.character,44,58,42,287),
        edge:{ 
            0:new Sprite(g_images.character,32,51,177,37),
            1: new Sprite(g_images.character,31,51,306,37)
        },
        rev:{
            idle:{
            0: new Sprite(g_images.character_rev,30,52,50,162),
            1: new Sprite(g_images.character_rev,30,52,562,36),
            2: new Sprite(g_images.character_rev,30,52,434,37)
            },
            walk:{
                0: new Sprite(g_images.character_rev,27,52,180,288),
                1: new Sprite(g_images.character_rev,29,52,308,289),
                2: new Sprite(g_images.character_rev,29,52,436,289),
                3: new Sprite(g_images.character_rev,28,52,562,287)
            },
            jump:{
                0:new Sprite(g_images.character_rev,30,52,178,163),
                1: new Sprite(g_images.character_rev,30,52,306,162),
                2: new Sprite(g_images.character_rev,30,52,433,163),
                3: new Sprite(g_images.character_rev,30,57,561,161)
            },
            chock: new Sprite(g_images.character_rev,30,52,50,36),
            rotate: new Sprite(g_images.character_rev,44,58,42,287),
            edge:{ 
                0:new Sprite(g_images.character_rev,32,51,177,37),
                1: new Sprite(g_images.character_rev,31,51,306,37)
            }
        }
    }

   

    entityManager.init();
    createInitialCharacter();

    main.init();
}

// Kick it off
requestPreloads();