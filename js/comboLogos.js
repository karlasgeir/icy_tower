// ========================
// COMBOS AND NOTIFICATIONS
// ========================

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_comboLogos = {

	cx: 0,
	cy: g_canvas.height/2,
	timeInMiddle: 600/NOMINAL_UPDATE_INTERVAL,
	rotation: 0,
	speed : 3,
	newCombo: false,
	isOn : []
};

var NEW_COMBO = false;

g_comboLogos.logoPicker = function () {

	var arrayLength = this.isOn.length;
	var currentNotification;
	var plats = g_PLATS_GONE_IN_COMBO;

	var oldID = this.isOn[arrayLength];

	if (plats>5 && plats<=14) {
		currentNotification = g_sprites.notifications.good;          
		currentNotification.scale = 1;
		g_FIREBOLTS = 20;
		this.ifDoesntExist(1);
	}
	if (plats>14 && plats<=24) {
		currentNotification = g_sprites.notifications.sweet;
		currentNotification.scale = 1.3;
		g_FIREBOLTS = 30;
		this.ifDoesntExist(2);
	}
	if (plats>24 && plats<=34) {
		currentNotification = g_sprites.notifications.great;
		currentNotification.scale = 1.5;
		g_FIREBOLTS = 40;
		this.ifDoesntExist(3);
	}
	if (plats>34 && plats<=50) {
		currentNotification = g_sprites.notifications.super;
		currentNotification.scale = 1.8;
		g_FIREBOLTS = 50;
		this.ifDoesntExist(4);
	}
	if (plats>50 && plats<=70) {
		currentNotification = g_sprites.notifications.wow;
		currentNotification.scale = 2;
		g_FIREBOLTS = 60;
		this.ifDoesntExist(5);
	}
	if (plats>70 && plats<=100) {
		currentNotification = g_sprites.notifications.amazing;
		currentNotification.scale = 2.5;
		this.ifDoesntExist(6);
	}
	if (plats>100 && plats<=140) {
		currentNotification = g_sprites.notifications.extreme;
		currentNotification.scale = 2.8;
		g_FIREBOLTS = 80;
		this.ifDoesntExist(7);
	}
	if (plats>140 && plats<=180) {
		currentNotification = g_sprites.notifications.fantastic;
		currentNotification.scale = 3;
		this.ifDoesntExist(8);
	}
	if (plats>180 && plats<=250) {
		currentNotification = g_sprites.notifications.splendid;
		currentNotification.scale = 3.2;
		g_FIREBOLTS = 90;
		this.ifDoesntExist(9);
	}
	if (plats>200) {
		currentNotification = g_sprites.notifications.noway;
		currentNotification.scale = 3.5;
		g_FIREBOLTS = 100;
		this.ifDoesntExist(10);
	}

	var newID = this.isOn[arrayLength];


	if (!g_COMBO) {
		this.resetNotification();
	}

	if (oldID !== newID) {
		this.newCombo = true;
	} else {this.newCombo = false;}

	return currentNotification;
}

g_comboLogos.ifDoesntExist = function (item) {
	var arrayLength = this.isOn.length;
	for (var i = 0; i<arrayLength; i++) {
		if (this.isOn[i] === item) {
			return;
		}
	}
	this.isOn.push(item);
}

g_comboLogos.resetNotification = function() {

	this.cx = 0;
	this.cy = g_canvas.height/2;
	this.timeInMiddle = 600/NOMINAL_UPDATE_INTERVAL;
	this.rotation = 0;
	this.speed = 3;
	this.newCombo = false;
	
};

g_comboLogos.render = function(ctx) {

	var sprite = this.logoPicker();
	if(typeof sprite === 'undefined'){
		return;
 	};

	if (!gameOver) {
		sprite.drawCentredAt(ctx, this.cx, this.cy, this.rotation);
	}
}


g_comboLogos.update = function (du) {

	var sprite = this.logoPicker();
	if(typeof sprite === 'undefined'){
		return;
 	};

	if (gameOver || g_MENU_SCREEN) {
		this.timeInMiddle = 600/NOMINAL_UPDATE_INTERVAL;
		return;
	}

	var randomFactor = util.randRange(-3,3);

    var flameVelX = randomFactor*(this.speed); 
    var flameVelY = randomFactor*(this.speed);

    var dX = +Math.sin(this.rotation);
    var dY = -Math.cos(this.rotation);

	if (this.cx < g_canvas.width/2) {
		this.speed = 20;
		this.cx +=this.speed*du;
		this.rotation += 2;

		entityManager.generateFlame(
        this.cx+dX, 
        this.cy+dY,
        flameVelX, 
        flameVelY,
        this.rotation); 

		return;
	}


	
	if (this.cx >= g_canvas.width/2 && this.timeInMiddle > 0) {
		this.cx = g_canvas.width/2;
		this.rotation = 0;
		this.timeInMiddle -=du;
	}
	if (this.timeInMiddle <= 0 && this.cx<=g_canvas.width+sprite.width) {
		this.speed = 50;
		this.cx +=this.speed*du;
		entityManager.generateExplotion(this.cx,this.cy);
	}
	if (this.cx>=g_canvas.width+sprite.width && this.newCombo) {
		this.resetNotification();
	}
}
