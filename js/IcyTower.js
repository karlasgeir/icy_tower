// =========
// IcyTower
// =========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

//Ugly global for game over stuff

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// =====================
// CREATE THE DEMON DUDE
// =====================
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
    g_background.update(du);
    g_notification.update(du);
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

    if (eatKey(KEY_HALT)) entityManager.haltCharacters();

    if (eatKey(KEY_RESET)) entityManager.resetCharacters();

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

    g_background.render(ctx);

    if (!gameOver && !g_MENU_SCREEN) {
        entityManager.render(ctx);
        g_notification.render(ctx);
    }

    if (gameOver && g_MENU_SCREEN) {
        g_menu.render(ctx); 
    }
    if (gameOver && !g_MENU_SCREEN){
        g_gameover.render(ctx);
    }

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        character   : "res/spritesheet.png",
        character_rev  : "res/spritesheet-rev.png",
	    testplat : "res/platforms/platform.png",
        backgroundMenu : "res/backgrounds/backgroundPlaceholder.jpg",
        gameBackground : "res/backgrounds/gB7.png",
        logo : "res/backgrounds/logo.png",
        startGame : "res/backgrounds/start.png",
        mainMenu : "res/backgrounds/mainMenu.png",
        gameOver : "res/backgrounds/gameOver.png",
        score : "res/backgrounds/score.png",
        go : "res/comboLogos/go.png",
        fireball: "res/fireballz.png",
        wallsprite : "res/walls/bigger/wallBig2.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {

   
    //Loading all the sprite
    g_sprites.testplat = new Sprite(g_images.testplat,g_images.testplat.width,g_images.testplat.height,0,0);

    g_sprites.wallsprite = new Sprite(g_images.wallsprite,g_images.wallsprite.width,g_images.wallsprite.height,0,0);
    g_left_side = g_sprites.wallsprite.width/2;
    g_right_side = g_canvas.width - g_sprites.wallsprite.width/2;
     
    g_sprites.backgroundMenu = new Sprite(
        g_images.backgroundMenu,g_images.backgroundMenu.width,g_images.backgroundMenu.height,0,0);

    g_sprites.gameBackground = new Sprite(
        g_images.gameBackground,g_images.gameBackground.width,g_images.gameBackground.height,0,0);
    
    g_sprites.logo = new Sprite(g_images.logo,g_images.logo.width,g_images.logo.height,0,0);
    g_sprites.startGame = new Sprite(g_images.startGame,g_images.startGame.width,g_images.startGame.height,0,0);

    g_sprites.mainMenu = new Sprite(g_images.mainMenu,g_images.mainMenu.width,g_images.mainMenu.height,0,0);
    g_sprites.score = new Sprite(g_images.score,g_images.score.width,g_images.score.height,0,0);
    g_sprites.gameOver = new Sprite(g_images.gameOver,g_images.gameOver.width,g_images.gameOver.height,0,0);

    g_sprites.go = new Sprite(g_images.go,g_images.go.width,g_images.go.height,0,0);

    g_sprites.fireball = {
        rotating: {
            0: new Sprite(g_images.fireball, 13, 10, 5, 35),
            1: new Sprite(g_images.fireball, 13, 11, 22, 34),
            2: new Sprite(g_images.fireball, 11, 11, 42, 34),
            3: new Sprite(g_images.fireball, 13, 11, 60, 33),
            4: new Sprite(g_images.fireball, 11, 12, 76, 32),
            5: new Sprite(g_images.fireball, 12, 12, 90, 32),
            6: new Sprite(g_images.fireball, 12, 10, 103, 34),
            7: new Sprite(g_images.fireball, 12, 11, 116, 35),
            8: new Sprite(g_images.fireball, 11, 12, 129, 35),
            9: new Sprite(g_images.fireball, 12, 12, 141, 35)
        },
    }

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
            0: new Sprite(g_images.character_rev,30,52,176,37),
            1: new Sprite(g_images.character_rev,30,52,48,36),
            2: new Sprite(g_images.character_rev,30,52,176,37)
            },
            walk:{
                0: new Sprite(g_images.character_rev,27,51,433,289),
                1: new Sprite(g_images.character_rev,28,52,304,289),
                2: new Sprite(g_images.character_rev,28,51,176,290),
                3: new Sprite(g_images.character_rev,28,52,50,287)
            },
            jump:{
                0:new Sprite(g_images.character_rev,29,52,433,163),
                1: new Sprite(g_images.character_rev,29,52,305,162),
                2: new Sprite(g_images.character_rev,29,52,178,163),
                3: new Sprite(g_images.character_rev,28,57,50,161)
            },
            chock: new Sprite(g_images.character_rev,30,52,560,36),
            rotate: new Sprite(g_images.character_rev,44,58,42,287),
            edge:{ 
                0:new Sprite(g_images.character_rev,32,51,431,37),
                1: new Sprite(g_images.character_rev,30,52,560,36)
            }
        }
    }

   

    createInitialCharacter();

    main.init();
}

// Kick it off
requestPreloads();