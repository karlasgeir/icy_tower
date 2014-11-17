// ========================
// COMBOS AND NOTIFICATIONS
// ========================

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_combo = {

	cx: g_canvas.width,
	cy: g_canvas.height/2,
	timeInMiddle: 600/NOMINAL_UPDATE_INTERVAL,
	rotation: 0,
	speed : 3
}

g_combo.logoPicker = function () {

	var currentNotification;
	var plats = g_PLATS_GONE_IN_COMBO;

	if (plats>5 && plats<=10) {
		g_combo.resetNotification();
		currentNotification = g_sprites.notifications.good;
	}
	if (plats>10 && plats<=15) {
		g_combo.resetNotification();
		currentNotification = g_sprites.notifications.sweet;
	}
	if (plats>15 && plats<=25) {
		g_combo.resetNotification();
		currentNotification = g_sprites.notifications.great;
	}
	if (plats>25 && plats<=35) {
		g_combo.resetNotification();
		currentNotification = g_sprites.notifications.super;
	}
	if (plats>35 && plats<=50) {
		g_combo.resetNotification();
		currentNotification = g_sprites.notifications.wow;
	}
	if (plats>50 && plats<=70) {
		g_combo.resetNotification();
		currentNotification = g_sprites.notifications.amazing;
	}
	if (plats>70 && plats<=100) {
		g_combo.resetNotification();
		currentNotification = g_sprites.notifications.extreme;
	}
	if (plats>100 && plats<=140) {
		g_combo.resetNotification();
		currentNotification = g_sprites.notifications.fantastic;
	}
	if (plats>140 && plats<=200) {
		g_combo.resetNotification();
		currentNotification = g_sprites.notifications.splendid;
	}
	if (plats>200) {
		g_combo.resetNotification();
		currentNotification = g_sprites.notifications.noway;
	}

	return currentNotification;
}

g_combo.resetNotification = function() {
	this.cx = g_canvas.width/2;
	this.cy = g_canvas.height/2;
	this.timeInMiddle = 600/NOMINAL_UPDATE_INTERVAL;
	this.rotation = 0;
	this.speed = 3;	
};

g_combo.render = function(ctx) {

	var sprite = this.logoPicker();

	if(typeof sprite === 'undefined'){
		return;
 	};

	if (!gameOver) {
		sprite.drawCentredAt(ctx, this.cx, this.cy, this.rotation);
	}
}


g_combo.update = function (du) {

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
