// ========================
// NOTIFICATIONS
// ========================

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var NOMINAL_START_POS = -100;
function Notification(type,scale){
	//Initial values
	this.timeInMiddle = 600/NOMINAL_UPDATE_INTERVAL;
	this.rotation = 0;
	this.speed = 3;
	this.doExplotion = true;
	this.hurryUpSpeed = 8;
	this.sprite = g_sprites.notifications;

	this.cy =  util.randRange(200, 400);
	this.cx = NOMINAL_START_POS;
	//swich dependant on the type of notification
	switch(type){
		case "GO":
			this.activeSprite = this.sprite.go;
			this.cy = g_canvas.height/2;
			this.doExplotion = false;
			break;
		case "GOOD":
			this.activeSprite = this.sprite.good;
			break;
		case "SWEET":
			this.activeSprite = this.sprite.sweet;
			break;
		case "GREAT":
			this.activeSprite = this.sprite.great;
			break;
		case "SUPER":
			this.activeSprite = this.sprite.super;
			break;
		case "WOW":
			this.activeSprite = this.sprite.wow;
			break;
		case "AMAZING":
			this.activeSprite = this.sprite.amazing;
			break;
		case "EXTREME":
			this.activeSprite = this.sprite.extreme;
			break;
		case "FANTASTIC":
			this.activeSprite = this.sprite.fantastic;
			break;
		case "SPLENDID":
			this.activeSprite = this.sprite.splendid;
			break;
		case "NOWAY":
			this.activeSprite = this.sprite.noway;
			break;
		case "SUPERJUMP":
			this.cy = g_canvas.height/4;
			this.activeSprite = this.sprite.superjump;
			break;
		case "SUPERBOOST":
			this.cy = g_canvas.height/4;
			this.activeSprite = this.sprite.superboost;
			break;
		case "HURRYUP":
			this.activeSprite = this.sprite.hurryup;
			this.cy = g_canvas.height+this.activeSprite.height;
			break;
	}
	this.scale = scale;
}

Notification.prototype.scale = 1;

Notification.prototype = new Entity();
//Audio for the notifications
Notification.prototype.comboFW = new Audio("res/sounds/flameWind.wav");
Notification.prototype.rotationSFX = new Audio("res/sounds/rotationSFX.wav");
Notification.prototype.spinSFXOne = new Audio("res/sounds/spinsAndWooshes/spinOne.wav");
Notification.prototype.spinSFXTwo = new Audio("res/sounds/spinsAndWooshes/spinTwo.wav");
Notification.prototype.wooshSFXOne = new Audio("res/sounds/spinsAndWooshes/wooshOne.wav");
Notification.prototype.wooshSFXTwo = new Audio("res/sounds/spinsAndWooshes/wooshTwo.wav");
Notification.prototype.wooshSFXThree = new Audio("res/sounds/spinsAndWooshes/wooshThree.wav");

/*
	Render notifications
*/
Notification.prototype.render = function(ctx) {
	if (!gameOver) {
		var oldscale = this.activeSprite.scale;
		this.activeSprite.scale = this.scale;
		this.activeSprite.drawCentredAt(ctx, this.cx, this.cy, this.rotation);
		this.activeSprite.scale = oldscale;
	}
};

/*
	Update notifications
*/
Notification.prototype.update = function (du) {
	//Check for death
	if(this._isDeadNow){return entityManager.KILL_ME_NOW;}

	if (gameOver || g_MENU_SCREEN) {
		this.timeInMiddle = 600/NOMINAL_UPDATE_INTERVAL;
		return;
	}

	if (this.activeSprite === this.sprite.hurryup) {
		this.cy -= this.hurryUpSpeed*du;
		this.spinSFXTwo.play();
	}

	/*
		Do the flame particle calculations
	*/
	var randomFactor = util.randRange(-3,3);

    var flameVelX = randomFactor*(this.speed); 
    var flameVelY = randomFactor*(this.speed);

    var dX = +Math.sin(this.rotation);
    var dY = -Math.cos(this.rotation);
    var flameGrav = 0.5;

    //If the notification isn't half way accross the screen
	if (this.cx < g_canvas.width/2) {
		//Rotate and go left 
		this.speed = 20;
		this.cx +=this.speed*du;
		this.rotation += 2;
		this.spinSFXTwo.play();
		//Generate fire particles on some notifications
		if(this.doExplotion)entityManager.generateFlame(
        this.cx+dX, 
        this.cy+dY,
        flameVelX, 
        flameVelY,
        flameGrav,
        this.rotation); 
		return;
	} 
	
	//Stay in the middle for the specified time
	if (this.cx >= g_canvas.width/2 && this.timeInMiddle > 0) {
		this.cx = g_canvas.width/2;
		this.rotation = 0;
		this.timeInMiddle -=du;
	}
	//When the time is up
	if (this.timeInMiddle <= 0 && this.cx<=g_canvas.width+this.activeSprite.getWidth()/2) {
		if (this.activeSprite === this.sprite.go) {
			this.wooshSFXThree.play();
		} else {
			this.comboFW.play();
		}
		//Go right fast
		this.speed = 50;
		this.cx +=this.speed*du;
		//Do explotions if there should be explotions
		if(this.doExplotion) entityManager.generateEffect(this.cx,this.cy,"FIREBLAST");
	}
	//Kill it when it's off the canvas
	if(this.cx > g_canvas.width+this.activeSprite.getWidth()/2){
		this.kill();
	}
}
