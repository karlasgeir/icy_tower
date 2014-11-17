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
    g_combo.update(du);
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
        g_SCORE.render(ctx);
        g_notification.render(ctx);
        g_combo.render(ctx);
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
	    platform : "res/platforms/platformspritesheet.png",
        backgroundMenu : "res/backgrounds/backgroundPlaceholder.jpg",
        gameBackground : "res/backgrounds/gB7.png",
        logo : "res/backgrounds/logo.png",
        startGame : "res/backgrounds/start.png",
        mainMenu : "res/backgrounds/mainMenu.png",
        gameOver : "res/backgrounds/gameOver.png",
        score : "res/backgrounds/score.png",
        notifications : "res/comboLogos/combospritesheet.png",
        go : "res/comboLogos/go.png",
        fireball: "res/fireballz.png",
        power: "res/powerUps/powerUpTest.png",
        wallsprite : "res/walls/bigger/wallBig2.png",
        numbers: "res/scoreNumbers/numbersspritesheet.png",
        fire: "res/Ground/fire/firespritesheet.png",
        explotion: "res/explotion/explotionspritesheet.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {
    /*
        Loading all the sprites
    */
    //Explotions
    g_sprites.explotion = [
        new Sprite(g_images.explotion,17,15,49,90),
        new Sprite(g_images.explotion,18,17,177,90),
        new Sprite(g_images.explotion,19,18,305,90),
        new Sprite(g_images.explotion,22,25,430,88),
        new Sprite(g_images.explotion,23,26,558,88),
        new Sprite(g_images.explotion,25,28,685,87),
        new Sprite(g_images.explotion,25,28,813,87),
        new Sprite(g_images.explotion,27,34,940,82),
        new Sprite(g_images.explotion,31,35,44,209),
        new Sprite(g_images.explotion,32,37,172,208),
        new Sprite(g_images.explotion,34,37,299,208),
        new Sprite(g_images.explotion,36,40,426,207),
        new Sprite(g_images.explotion,38,41,553,206),
        new Sprite(g_images.explotion,39,42,681,205),
        new Sprite(g_images.explotion,40,43,808,205),
        new Sprite(g_images.explotion,41,41,936,204),
        new Sprite(g_images.explotion,42,46,40,331),
        new Sprite(g_images.explotion,44,46,167,331),
        new Sprite(g_images.explotion,44,47,295,330),
        new Sprite(g_images.explotion,47,48,421,330),
        new Sprite(g_images.explotion,49,49,548,329),
        new Sprite(g_images.explotion,49,49,676,329),
        new Sprite(g_images.explotion,50,51,804,328),
        new Sprite(g_images.explotion,52,53,931,327),
        new Sprite(g_images.explotion,53,53,35,455),
        new Sprite(g_images.explotion,53,53,163,455),
        new Sprite(g_images.explotion,55,55,290,454),
        new Sprite(g_images.explotion,56,55,417,454),
        new Sprite(g_images.explotion,58,57,544,453),
        new Sprite(g_images.explotion,58,57,672,453),
        new Sprite(g_images.explotion,60,58,799,452),
        new Sprite(g_images.explotion,62,59,926,451),
        new Sprite(g_images.explotion,62,59,30,578),
        new Sprite(g_images.explotion,64,61,157,578),
        new Sprite(g_images.explotion,65,62,284,578),
        new Sprite(g_images.explotion,66,63,412,577),
        new Sprite(g_images.explotion,67,63,539,577),
        new Sprite(g_images.explotion,68,64,667,576),
        new Sprite(g_images.explotion,69,64,795,576),
        new Sprite(g_images.explotion,69,62,923,578),
        new Sprite(g_images.explotion,70,63,27,705),
        new Sprite(g_images.explotion,71,64,155,704),
        new Sprite(g_images.explotion,73,65,282,703),
        new Sprite(g_images.explotion,72,66,412,702),
        new Sprite(g_images.explotion,73,67,539,701),
        new Sprite(g_images.explotion,74,67,667,701),
        new Sprite(g_images.explotion,74,68,796,700),
        new Sprite(g_images.explotion,75,69,923,699),
        new Sprite(g_images.explotion,76,71,27,825),
        new Sprite(g_images.explotion,76,72,156,824),
        new Sprite(g_images.explotion,76,73,284,823),
        new Sprite(g_images.explotion,77,74,412,822),
        new Sprite(g_images.explotion,78,76,540,820),
        new Sprite(g_images.explotion,79,77,667,819),
        new Sprite(g_images.explotion,78,79,796,817),
        new Sprite(g_images.explotion,79,80,924,816),
        new Sprite(g_images.explotion,79,82,29,942),
        new Sprite(g_images.explotion,81,83,156,941),
        new Sprite(g_images.explotion,80,85,286,939),
        new Sprite(g_images.explotion,80,86,414,938),
        new Sprite(g_images.explotion,81,87,542,937),
        new Sprite(g_images.explotion,82,89,670,935),
        new Sprite(g_images.explotion,82,91,798,933),
        new Sprite(g_images.explotion,83,92,926,932)
    ];

    //Fire on the ground
    g_sprites.fire = [
        new Sprite(g_images.fire,67,70,33,53),
        new Sprite(g_images.fire,67,70,161,53),
        new Sprite(g_images.fire,67,70,289,53),
        new Sprite(g_images.fire,67,70,417,53),
        new Sprite(g_images.fire,67,70,545,53),
        new Sprite(g_images.fire,67,70,673,53),
        new Sprite(g_images.fire,67,70,794,53),
        new Sprite(g_images.fire,67,70,922,53),
        new Sprite(g_images.fire,67,70,1050,53),
        new Sprite(g_images.fire,67,70,1178,53),
        new Sprite(g_images.fire,67,70,33,183),
        new Sprite(g_images.fire,67,70,161,183),
        new Sprite(g_images.fire,67,70,289,183),
        new Sprite(g_images.fire,67,70,417,183),
        new Sprite(g_images.fire,67,70,545,183),
        new Sprite(g_images.fire,67,70,673,183),
        new Sprite(g_images.fire,67,70,794,183),
        new Sprite(g_images.fire,67,70,922,183),
        new Sprite(g_images.fire,67,70,1050,183),
        new Sprite(g_images.fire,67,70,1178,183),
        new Sprite(g_images.fire,67,70,33,304),
        new Sprite(g_images.fire,67,70,161,304),
        new Sprite(g_images.fire,67,70,289,304),
        new Sprite(g_images.fire,67,70,417,304),
        new Sprite(g_images.fire,67,70,545,304),
        new Sprite(g_images.fire,67,70,673,304),
        new Sprite(g_images.fire,67,70,794,304),
        new Sprite(g_images.fire,67,70,922,304),
        new Sprite(g_images.fire,67,70,1050,304),
        new Sprite(g_images.fire,67,70,1178,304),
        new Sprite(g_images.fire,67,70,33,436),
        new Sprite(g_images.fire,67,70,161,436),
        new Sprite(g_images.fire,67,70,289,436),
        new Sprite(g_images.fire,67,70,417,436),
        new Sprite(g_images.fire,67,70,545,436),
        new Sprite(g_images.fire,67,70,673,436),
        new Sprite(g_images.fire,67,70,794,436),
        new Sprite(g_images.fire,67,70,922,436),
        new Sprite(g_images.fire,67,70,1050,436),
        new Sprite(g_images.fire,67,70,1178,436),
        new Sprite(g_images.fire,67,70,33,561),
        new Sprite(g_images.fire,67,70,161,561),
        new Sprite(g_images.fire,67,70,289,561),
        new Sprite(g_images.fire,67,70,417,561),
        new Sprite(g_images.fire,67,70,545,561),
        new Sprite(g_images.fire,67,70,673,561),
        new Sprite(g_images.fire,67,70,794,561),
        new Sprite(g_images.fire,67,70,922,561),
        new Sprite(g_images.fire,67,70,1050,561),
        new Sprite(g_images.fire,67,70,1178,561),
        new Sprite(g_images.fire,67,70,33,688),
        new Sprite(g_images.fire,67,70,161,688),
        new Sprite(g_images.fire,67,70,289,688),
        new Sprite(g_images.fire,67,70,417,688),
        new Sprite(g_images.fire,67,70,545,688),
        new Sprite(g_images.fire,67,70,673,688),
        new Sprite(g_images.fire,67,70,794,688),
        new Sprite(g_images.fire,67,70,922,688),
        new Sprite(g_images.fire,67,70,1050,688),
        new Sprite(g_images.fire,67,70,1178,688),
        new Sprite(g_images.fire,67,70,33,809),
        new Sprite(g_images.fire,67,70,161,809),
        new Sprite(g_images.fire,67,70,289,809),
        new Sprite(g_images.fire,67,70,417,809),
        new Sprite(g_images.fire,67,70,545,809),
        new Sprite(g_images.fire,67,70,673,809),
        new Sprite(g_images.fire,67,70,794,809),
        new Sprite(g_images.fire,67,70,922,809),
        new Sprite(g_images.fire,67,70,1050,809),
        new Sprite(g_images.fire,67,70,1178,809),
        new Sprite(g_images.fire,67,70,33,939),
        new Sprite(g_images.fire,67,70,161,939),
        new Sprite(g_images.fire,67,70,289,939),
        new Sprite(g_images.fire,67,70,417,939),
        new Sprite(g_images.fire,67,70,545,939),
        new Sprite(g_images.fire,67,70,673,939),
        new Sprite(g_images.fire,67,70,794,939),
        new Sprite(g_images.fire,67,70,922,939),
        new Sprite(g_images.fire,67,70,1050,939),
        new Sprite(g_images.fire,67,70,1178,939),
    ];
    //minnkum eldinn
    g_sprites.fire.forEach(function(fireSprite){
        fireSprite.scale = 0.8;
    });
    //Sprites for the platform
    g_sprites.platform = {
        normal:{
            whole: new Sprite(g_images.platform,120,30,132,48),
            left: new Sprite(g_images.platform,16,32,312,47),
            middle: new Sprite(g_images.platform,16,32,440,47),
            right: new Sprite(g_images.platform,16,32,56,173)
        },
        lava: new Sprite(g_images.platform,120,30,4,48),
        rainbow:{
            whole: new Sprite(g_images.platform,120,30,388,174),
            left: new Sprite(g_images.platform,16,32,184,173),
            middle: new Sprite(g_images.platform,16,32,312,173),
            right: new Sprite(g_images.platform,16,32,56,299)
        },
        snow: new Sprite(g_images.platform,120,30,132,300),
        wood:{
            whole: new Sprite(g_images.platform,120,30,132,426),
            left: new Sprite(g_images.platform,16,32,440,299),
            middle: new Sprite(g_images.platform,16,32,56,425),
            right: new Sprite(g_images.platform,16,32,312,425)
        },
        sign:new Sprite(g_images.platform,41,21,428,431)
    };

    //Power sprite
    g_sprites.power = new Sprite(g_images.power,g_images.power.width,g_images.power.height,0,0);

    //Sprites for the wall
    g_sprites.wallsprite = new Sprite(g_images.wallsprite,g_images.wallsprite.width,g_images.wallsprite.height,0,0);
     //Sprites for the menus
    g_sprites.backgroundMenu = new Sprite(
        g_images.backgroundMenu,g_images.backgroundMenu.width,g_images.backgroundMenu.height,0,0);
    g_sprites.mainMenu = new Sprite(g_images.mainMenu,g_images.mainMenu.width,g_images.mainMenu.height,0,0);
    g_sprites.logo = new Sprite(g_images.logo,g_images.logo.width,g_images.logo.height,0,0);
    g_sprites.startGame = new Sprite(g_images.startGame,g_images.startGame.width,g_images.startGame.height,0,0);
    g_sprites.score = new Sprite(g_images.score,g_images.score.width,g_images.score.height,0,0);
    g_sprites.gameOver = new Sprite(g_images.gameOver,g_images.gameOver.width,g_images.gameOver.height,0,0);

    //The game background
    g_sprites.gameBackground = new Sprite(
        g_images.gameBackground,g_images.gameBackground.width,g_images.gameBackground.height,0,0);

    //Sprites for the notifications
    g_sprites.notifications={
        go: new Sprite(g_images.go,g_images.go.width,g_images.go.height,0,0),
        amazing: new Sprite(g_images.notifications,120,22,4,52),
        extreme: new Sprite(g_images.notifications,120,23,132,52),
        fantastic: new Sprite(g_images.notifications,120,22,260,52),
        good: new Sprite(g_images.notifications,120,39,388,44),
        great: new Sprite(g_images.notifications,120,33,4,173),
        noway: new Sprite(g_images.notifications,120,26,132,176),
        splendid: new Sprite(g_images.notifications,120,24,260,177),
        super: new Sprite(g_images.notifications,120,32,388,173),
        sweet: new Sprite(g_images.notifications,120,31,4,300),
        wow: new Sprite(g_images.notifications,120,38,132,296),
    }

    //Sprites for numbers
    g_sprites.numbers = {
        0: new Sprite(g_images.numbers,71,66,157,282),
        1: new Sprite(g_images.numbers,51,63,39,158),
        2: new Sprite(g_images.numbers,58,69,35,281),
        3: new Sprite(g_images.numbers,58,67,419,155),
        4: new Sprite(g_images.numbers,61,68,290,29),
        5: new Sprite(g_images.numbers,49,65,168,31),
        6: new Sprite(g_images.numbers,58,66,291,156),
        7: new Sprite(g_images.numbers,55,61,165,159),
        8: new Sprite(g_images.numbers,57,65,36,31),
        9: new Sprite(g_images.numbers,69,66,414,30),
    }
    

    //Sprites for powerups and addons
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

    //Sprites for the character
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