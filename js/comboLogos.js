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
	isOn : []
};

g_comboLogos.checkCombos = function () {

	var arrayLength = this.isOn.length;
	var plats = g_PLATS_GONE_IN_COMBO;
	var currentNotification = {name:"",scale:1};
	var shouldDraw = false;

	if (plats>5 && plats<=14) {
		currentNotification.name = "GOOD";
		currentNotification.scale = 1;
		shouldDraw = this.ifDoesntExist(1);
		g_FIREBOLTS = 6;
		
	}
	if (plats>14 && plats<=24) {
		currentNotification.name = "SWEET";
		currentNotification.scale = 1.3;
		g_SCORE_MULTIPLIER =2;
		shouldDraw = this.ifDoesntExist(2);
		g_FIREBOLTS = 10;
		
	}
	if (plats>24 && plats<=34) {
		currentNotification.name = "GREAT";
		currentNotification.scale = 1.5;
		shouldDraw = this.ifDoesntExist(3);
		g_FIREBOLTS = 15;
		
	}
	if (plats>34 && plats<=50) {
		currentNotification.name = "SUPER";
		currentNotification.scale = 1.8;
		g_SCORE_MULTIPLIER =3;
		shouldDraw = this.ifDoesntExist(4);
		g_FIREBOLTS = 20;
		
	}
	if (plats>50 && plats<=70) {
		currentNotification.name = "WOW";
		currentNotification.scale = 2;
		shouldDraw = this.ifDoesntExist(5);
	}
	if (plats>70 && plats<=100) {
		currentNotification.name = "AMAZING";
		currentNotification.scale = 2.5;
		g_SCORE_MULTIPLIER =4;
		shouldDraw = this.ifDoesntExist(6);
		
	}
	if (plats>100 && plats<=140) {
		currentNotification.name = "EXTREME";
		currentNotification.scale = 2.8;
		shouldDraw = this.ifDoesntExist(7);
		g_FIREBOLTS = 30;
		
	}
	if (plats>140 && plats<=180) {
		currentNotification.name = "FANTASTIC";
		currentNotification.scale = 3;
		g_SCORE_MULTIPLIER =6;
		shouldDraw = this.ifDoesntExist(8);
		g_FIREBOLTS = 40;
		
	}
	if (plats>180 && plats<=220) {
		currentNotification.name = "SPLENDID";
		currentNotification.scale = 3.2;
		g_SCORE_MULTIPLIER =8;
		shouldDraw = this.ifDoesntExist(9);
		
	}
	if (plats>220) {
		g_SCORE_MULTIPLIER =10;
		currentNotification.name = "NOWAY";
		currentNotification.scale = 3.5;
		shouldDraw = this.ifDoesntExist(10);
		g_FIREBOLTS = 50;
		
	}

	if (!g_COMBO) {
		this.resetNotification();
		g_SCORE_MULTIPLIER =1;
	}
	//return currentNotification;
	if(shouldDraw) entityManager.generateNotification(currentNotification.name,currentNotification.scale);
}

g_comboLogos.ifDoesntExist = function (item) {
	var arrayLength = this.isOn.length;
	for (var i = 0; i<arrayLength; i++) {
		if (this.isOn[i] === item) {
			return false;
		}
	}
	this.isOn.push(item);
	return true;
}

g_comboLogos.resetNotification = function() {
	this.cx = 0;
	this.cy = g_canvas.height/2;
	this.timeInMiddle = 600/NOMINAL_UPDATE_INTERVAL;
	this.rotation = 0;
	this.speed = 3;
	this.isOn = [];
};