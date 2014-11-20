// =======
// GLOBALS
// =======
/*

Evil, ugly (but "necessary") globals, which everyone can use.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
//
var NOMINAL_UPDATE_INTERVAL = 16.666;

// Multiply by this to convert seconds into "nominals"
var SECS_TO_NOMINALS = 1000 / NOMINAL_UPDATE_INTERVAL;

//Other globals
var g_NUMBER_OF_PLATFORMS = 0;

var gameOver = true; //Tells you if the game is over

var g_GAME_HEIGHT = 0;      //The current height of the game
var g_GAME_TOP_HEIGHT =0;   //The highest the character has been

var g_MOVE_SCREEN = 0;      //The screen movement rate

var g_left_side = 0                 //The left side of the screen
var g_right_side = g_canvas.width;  //The right side of the screen

var g_bottom = g_canvas.height;

var g_MENU_SCREEN = true;           //Tells you if the menu screen is on

var g_TOP_FLOOR;                    //Holds the top platform

var g_SCORE;                        //Holds the Score object

var g_SCORE_MULTIPLIER = 1;         //Multiplies the score

var g_COMBO = false;                //Tells you if there is a cobo

var g_PLATS_GONE_IN_COMBO = 0;      //Tells you how many platforms are in the combo

var g_FIREBOLTS = 0;                //How many fireballs should spawn

var powerSprite_is_alive =false;    //tells you if the power sprite is alive

var g_VERTICAL_SPEED = 0.5;         //The vertical speed of loads of things

