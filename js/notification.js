// ========================
// NOTIFICATIONS
// ========================

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */
var NOMINAL_START_POS = -180;
function Notification(type,scale){
	this.cx = NOMINAL_START_POS;
	this.cy = g_canvas.height/2;
	this.timeInMiddle = 600/NOMINAL_UPDATE_INTERVAL;
	this.rotation = 0;
	this.speed = 3;
	this.doExplotion = true;
	this.sprite = g_sprites.notifications;
	if (!g_COMBO) {
		g_FIREBOLTS = 0;
	}
	switch(type){
		case "GO":
			this.activeSprite = this.sprite.go;
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
			this.activeSprite = this.sprite.superjump;
			break;
		case "SUPERBOOST":
			this.activeSprite = this.sprite.superboost;
			break;
		case "HURRYUP":
			this.activeSprite = this.sprite.hurryup;
			break;
	}
	this.scale = scale;
}

Notification.prototype.scale = 1;

Notification.prototype = new Entity();

Notification.prototype.render = function(ctx) {
	if (!gameOver) {
		var oldscale = this.activeSprite.scale;
		this.activeSprite.scale = this.scale;
		this.activeSprite.drawCentredAt(ctx, this.cx, this.cy, this.rotation);
		this.activeSprite.scale = oldscale;
	}
}


Notification.prototype.update = function (du) {
	if(this._isDeadNow){return entityManager.KILL_ME_NOW;}

	if (gameOver || g_MENU_SCREEN) {
		this.timeInMiddle = 600/NOMINAL_UPDATE_INTERVAL;
		return;
	}

	var randomFactor = util.randRange(-3,3);

    var flameVelX = randomFactor*(this.speed); 
    var flameVelY = randomFactor*(this.speed);

    var dX = +Math.sin(this.rotation);
    var dY = -Math.cos(this.rotation);
    var flameGrav = 0.5;

	if (this.cx < g_canvas.width/2) {
		this.speed = 20;
		this.cx +=this.speed*du;
		this.rotation += 2;

		if(this.doExplotion)entityManager.generateFlame(
        this.cx+dX, 
        this.cy+dY,
        flameVelX, 
        flameVelY,
        flameGrav,
        this.rotation); 
		return;
	} 
	
	if (this.cx >= g_canvas.width/2 && this.timeInMiddle > 0) {
		this.cx = g_canvas.width/2;
		this.rotation = 0;
		this.timeInMiddle -=du;
	}
	if (this.timeInMiddle <= 0 && this.cx<=g_canvas.width+this.activeSprite.width/2) {
		this.speed = 50;
		this.cx +=this.speed*du;
		if(this.doExplotion) entityManager.generateEffect(this.cx,this.cy,"EXPLOTION");
	}
	if(this.cx > g_canvas.width+this.activeSprite.width/2){
		this.kill();
	}


}
