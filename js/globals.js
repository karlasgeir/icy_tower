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

var gameOver = true;

var g_GAME_HEIGHT = 0;
var g_GAME_TOP_HEIGHT =0;

var g_MOVE_SCREEN = 0;

var g_left_side = 0
var g_right_side = g_canvas.width;

var g_GAME_SCORE=0;
var g_MENU_SCREEN = true;

var g_TOP_FLOOR = g_canvas.height;

var g_SCORE;

var g_COMBO = false;

var g_PLATS_GONE_IN_COMBO = 0;

