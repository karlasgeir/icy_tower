// ========================
// NOTIFICATIONS
// ========================

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */
var NOMINAL_START_POS = -180;
function Notification(type){
	this.cx = NOMINAL_START_POS,
	this.cy = g_canvas.height/2,
	this.timeInMiddle = 600/NOMINAL_UPDATE_INTERVAL,
	this.rotation = 0,
	this.speed = 3
	this.sprite = g_sprites.notifications;
	switch(type){
		case "GO":
			this.activeSprite = this.sprite.go;
			break;
	}
}

Notification.prototype = new Entity();

Notification.prototype.render = function(ctx) {
	if (!gameOver) {
		g_sprites.notifications.go.drawCentredAt(ctx, this.cx, this.cy, this.rotation);
	}
}


Notification.prototype.update = function (du) {
	if (gameOver || g_MENU_SCREEN) {
		this.timeInMiddle = 600/NOMINAL_UPDATE_INTERVAL;
		return;
	}

	if (this.cx < g_canvas.width/2) {
		this.speed = 20;
		this.cx +=this.speed*du;
		this.rotation += 2;
		return;
	} 
	
	if (this.cx >= g_canvas.width/2 && this.timeInMiddle > 0) {
		this.cx = g_canvas.width/2;
		this.rotation = 0;
		this.timeInMiddle -=du;
	}
	if (this.timeInMiddle <= 0 && this.cx<=g_canvas.width+g_sprites.notifications.go.width/2) {
		this.speed = 50;
		this.cx +=this.speed*du;
	}
}
