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
    if(gameOver)g_menu.update(du);
    g_comboLogos.checkCombos();
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = true;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_MIXED   = keyCode('M');
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
    }

    if(gameOver){
        g_menu.render(ctx);
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
	    platform : "res/platforms/platforms.png",
        backgroundMenu : "res/backgrounds/FlashFreeze.jpg",
        gameBackground : "res/backgrounds/gB5.png",
        menu:"res/menu.png",
        notifications : "res/notifications.png",
        fireball: "res/effects/fireballz.png",
        power: "res/powerUps/power_sheet.png",
        wallsprite : "res/walls/bigger/wallBig2.png",
        numbers: "res/numbers.png",
        flameTail: "res/effects/flamethrower.png",
        fire: "res/effects/fire.png",
        clock: "res/clock.png",
        explotion: "res/effects/explotion.png",
        flash: "res/effects/flash_a.png",
        fireBlast: "res/effects/fireball_hit.png",
        reaper: "res/powerUps/reaper.png",
        fireGonzales: "res/effects/fireball.png",
        space: "res/backgrounds/starsBackgr.jpg",
        spacePlatform: "res/platforms/spacePlatform.png",
        spaceSuit: "res/powerUps/spaceSuit.png",
        spaceSuitReversed:"res/powerUps/spaceSuit-reverse.png",
        redBricks: "res/backgrounds/gBfire.png",
        blood: "res/effects/bloodsplatter.png",
        platS: "res/powerUps/powerpad.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {
    /*
        Loading all the sprites
    */
    //Firebackr.
    g_sprites.redBricks = new Sprite(g_images.redBricks,g_images.redBricks.width,g_images.redBricks.height,0,0);

    //Space backgr and platf.
    g_sprites.space = new Sprite(g_images.space,g_images.space.width,g_images.space.height,0,0);
    g_sprites.spacePlatform = new Sprite(g_images.spacePlatform,g_images.spacePlatform.width,g_images.spacePlatform.height,0,0);

    //Clock and its indicator
    g_sprites.clock = new Sprite(g_images.clock,100,100,1,1);
    g_sprites.indicator = new Sprite(g_images.clock,100,100,102,1);

    //Effects
    g_sprites.effects ={

    //Flash
        flash: [
            new Sprite(g_images.flash,72,46,46,46),
            new Sprite(g_images.flash,68,56,172,37),
            new Sprite(g_images.flash,77,59,301,36),
            new Sprite(g_images.flash,72,62,51,161),
            new Sprite(g_images.flash,58,48,192,171),
            new Sprite(g_images.flash,43,43,321,176)
        ],

        blood: [
            new Sprite(g_images.blood,214,191,161,164),
            new Sprite(g_images.blood,279,283,637,114),
            new Sprite(g_images.blood,310,299,1134,111),
            new Sprite(g_images.blood,325,313,95,620),
            new Sprite(g_images.blood,342,321,600,617),
            new Sprite(g_images.blood,341,331,119,610)
        ],

    //Fireblast
        fireBlast: [
        new Sprite(g_images.fireBlast,98,87,24,23),
        new Sprite(g_images.fireBlast,101,94,142,18),
        new Sprite(g_images.fireBlast,107,99,266,14),
        new Sprite(g_images.fireBlast,108,102,8,137),
        new Sprite(g_images.fireBlast,110,105,135,135),
        new Sprite(g_images.fireBlast,112,105,262,135),
        new Sprite(g_images.fireBlast,111,105,7,259),
        new Sprite(g_images.fireBlast,108,104,138,259),
        new Sprite(g_images.fireBlast,107,102,268,259)
        ],

    //Explotions
        explotion: [
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
        ],

        flameTail : [
            new Sprite(g_images.flameTail,24,10,7,61),
            new Sprite(g_images.flameTail,19,15,135,58),
            new Sprite(g_images.flameTail,32,15,262,57),
            new Sprite(g_images.flameTail,58,23,390,49),
            new Sprite(g_images.flameTail,95,25,518,45),
            new Sprite(g_images.flameTail,102,34,646,39),
            new Sprite(g_images.flameTail,112,44,6,154),
            new Sprite(g_images.flameTail,112,52,134,148),
            new Sprite(g_images.flameTail,113,71,262,142),
            new Sprite(g_images.flameTail,113,79,390,138),
            new Sprite(g_images.flameTail,112,64,518,136),
            new Sprite(g_images.flameTail,111,69,646,136),
            new Sprite(g_images.flameTail,101,70,14,261),
            new Sprite(g_images.flameTail,109,73,135,261),
            new Sprite(g_images.flameTail,108,76,263,260),
            new Sprite(g_images.flameTail,96,72,398,260),
            new Sprite(g_images.flameTail,98,59,526,276),
            new Sprite(g_images.flameTail,76,61,675,276),
            new Sprite(g_images.flameTail,74,66,38,399),
            new Sprite(g_images.flameTail,80,63,157,404),
            new Sprite(g_images.flameTail,55,64,312,404),
            new Sprite(g_images.flameTail,33,49,462,420),
            new Sprite(g_images.flameTail,33,46,592,420),
            new Sprite(g_images.flameTail,34,44,719,418),
            new Sprite(g_images.flameTail,19,40,90,542),
            new Sprite(g_images.flameTail,18,39,219,540),
            new Sprite(g_images.flameTail,14,38,351,538)
        ]
    };

    //Fire sprites
    g_sprites.fire = {

        demonFire: [

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
            new Sprite(g_images.fire,67,70,1178,939)
        ]
    };
    //minnkum eldinn
    g_sprites.fire.demonFire.forEach(function(fireSprite){
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

    //Sprites for powerups
     g_sprites.power = {

        smaller: [
            new Sprite(g_images.platS,53,53,14,418),
            new Sprite(g_images.platS,55,55,93,418),
            new Sprite(g_images.platS,53,54,176,418),
            new Sprite(g_images.platS,54,53,256,418),
            new Sprite(g_images.platS,54,56,337,418),
            new Sprite(g_images.platS,54,54,419,418),
            new Sprite(g_images.platS,56,53,497,418),
            new Sprite(g_images.platS,53,57,581,418)
        ],

        bigger: [
            new Sprite(g_images.platS,53,53,14,337),
            new Sprite(g_images.platS,55,54,93,337),
            new Sprite(g_images.platS,53,53,176,337),
            new Sprite(g_images.platS,54,55,337,337),
            new Sprite(g_images.platS,54,53,419,337),
            new Sprite(g_images.platS,56,53,497,337),
            new Sprite(g_images.platS,53,56,581,337)
        ],

        ruby:[
            new Sprite(g_images.power,41,60,0,66),
            new Sprite(g_images.power,42,60,49,66),
            new Sprite(g_images.power,41,60,103,66),
            new Sprite(g_images.power,38,60,155,66),
            new Sprite(g_images.power,41,60,209,66),
            new Sprite(g_images.power,40,60,264,66),
            new Sprite(g_images.power,39,60,314,66)

        ],
        fire:[
            new Sprite(g_images.power,49,72,1,422),
            new Sprite(g_images.power,49,67,128,426),
            new Sprite(g_images.power,42,77,256,418),
            new Sprite(g_images.power,43,79,0,542),
            new Sprite(g_images.power,45,79,129,542),
            new Sprite(g_images.power,43,70,257,551)
        ],
        coin:[
            new Sprite(g_images.power,39,45,0,204),
            new Sprite(g_images.power,34,45,0,250),
            new Sprite(g_images.power,26,45,5,299),
            new Sprite(g_images.power,6,45,15,347)
        ],
        reaper:[
            new Sprite(g_images.reaper,60,65,7,349),
            new Sprite(g_images.reaper,67,64,79,349),
            new Sprite(g_images.reaper,62,64,160,350),
            new Sprite(g_images.reaper,48,65,236,349),
            new Sprite(g_images.reaper,48,65,251,425),
            new Sprite(g_images.reaper,78,65,160,425),
            new Sprite(g_images.reaper,67,66,84,424),
            new Sprite(g_images.reaper,65,64,9,426)
        ],
        spaceSuit:{
            idle:[
                new Sprite(g_images.spaceSuit,30,39,5,15),
                new Sprite(g_images.spaceSuit,30,39,309,15),
                new Sprite(g_images.spaceSuit,30,39,342,15)
            ],
            walk:[
                new Sprite(g_images.spaceSuit,27,37,39,17),
                new Sprite(g_images.spaceSuit,27,37,72,17),
                new Sprite(g_images.spaceSuit,26,35,108,19),
                new Sprite(g_images.spaceSuit,29,37,139,16)
            ],
            jump:[
                new Sprite(g_images.spaceSuit,29,45,173,9),
                new Sprite(g_images.spaceSuit,29,45,207,9),
                new Sprite(g_images.spaceSuit,27,38,242,16),
                new Sprite(g_images.spaceSuit,25,35,279,25)
            ],
            chock :new Sprite(g_images.spaceSuit,29,39,375,15),
            rotate: new Sprite(g_images.spaceSuit,36,45,411,12),
            edge:[
                new Sprite(g_images.spaceSuit,37,34,458,19),
                new Sprite(g_images.spaceSuit,37,34,500,19)
            ],
            rev:{
                idle:[
                    new Sprite(g_images.spaceSuitReversed,30,39,505,15),
                    new Sprite(g_images.spaceSuitReversed,30,39,201,15),
                    new Sprite(g_images.spaceSuitReversed,30,39,168,15)
                ],
                walk:[
                    new Sprite(g_images.spaceSuitReversed,27,37,474,17),
                    new Sprite(g_images.spaceSuitReversed,27,37,441,17),
                    new Sprite(g_images.spaceSuitReversed,26,35,406,19),
                    new Sprite(g_images.spaceSuitReversed,29,37,372,16)
                ],
                jump:[
                    new Sprite(g_images.spaceSuitReversed,29,45,338,9),
                    new Sprite(g_images.spaceSuitReversed,29,45,304,9),
                    new Sprite(g_images.spaceSuitReversed,27,38,271,16),
                    new Sprite(g_images.spaceSuitReversed,25,35,236,25)
                ],
                chock :new Sprite(g_images.spaceSuitReversed,29,39,136,15),
                rotate: new Sprite(g_images.spaceSuitReversed,36,45,93,12),
                edge:[
                    new Sprite(g_images.spaceSuitReversed,37,34,45,19),
                    new Sprite(g_images.spaceSuitReversed,37,34,3,19)
                ]
            }
        },
        skull: [new Sprite(g_images.power,55,59,345,341)]
    };
   
    

    //Sprites for the wall
    g_sprites.wallsprite = new Sprite(g_images.wallsprite,g_images.wallsprite.width,g_images.wallsprite.height,0,0);


     //Sprites for the menus
    g_sprites.backgroundMenu = new Sprite(
        g_images.backgroundMenu,g_images.backgroundMenu.width,g_images.backgroundMenu.height,0,0);
    g_sprites.menu = {
        mainMenu:{
            normal:new Sprite(g_images.menu,810,200,4551,101,0.5),
            hover: new Sprite(g_images.menu,810,200,1,403,0.5),
        },
        gameOver:{
            normal:new Sprite(g_images.menu,983,200,1,1,0.6),
            hover: new Sprite(g_images.menu,1005,200,986,1,0.6),
        },
        logo:new Sprite(g_images.menu,2556,400,1993,1,0.3),
        score:new Sprite(g_images.menu,529,200,812,403,0.3),
        start:{
            normal:new Sprite(g_images.menu,819,200,1343,403,0.5),
            hover: new Sprite(g_images.menu,819,200,2164,403,0.5),
        }
    };
    //The game background
    g_sprites.gameBackground = new Sprite(
        g_images.gameBackground,g_images.gameBackground.width,g_images.gameBackground.height,0,0);

    //Sprites for the notifications
    g_sprites.notifications={
        go: new Sprite(g_images.notifications,342,200,640,505),
        amazing: new Sprite(g_images.notifications,1086,200,418,51),
        extreme: new Sprite(g_images.notifications,1033,200,1506,51),
        fantastic: new Sprite(g_images.notifications,1089,200,2541,51),
        good: new Sprite(g_images.notifications,610,200,3632,51),
        great: new Sprite(g_images.notifications,735,200,1,303),
        noway: new Sprite(g_images.notifications,919,200,738,303),
        splendid: new Sprite(g_images.notifications,1013,200,1659,303),
        super: new Sprite(g_images.notifications,747,200,2674,303),
        sweet: new Sprite(g_images.notifications,781,200,3423,303),
        wow: new Sprite(g_images.notifications,637,200,1,505),
        hurryup: new Sprite(g_images.notifications,662,200,984,505),
        superboost: new Sprite(g_images.notifications,1071,200,1648,505),
        superjump: new Sprite(g_images.notifications,1019,200,2721,505),
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
    

    //Sprites for the fireball
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

    //Sprites for the fireball character
    g_sprites.fireGonzales = [
            new Sprite(g_images.fireGonzales,86,68,20,20),
            new Sprite(g_images.fireGonzales,99,73,137,19),
            new Sprite(g_images.fireGonzales,101,79,264,19),
            new Sprite(g_images.fireGonzales,100,79,9,145),
            new Sprite(g_images.fireGonzales,102,79,134,145),
            new Sprite(g_images.fireGonzales,102,83,261,146)
    ],

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
    main.init();
}

// Kick it off
requestPreloads();