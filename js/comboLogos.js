// ========================
// COMBOS AND NOTIFICATIONS
// ========================

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */
//This holds most of the stuff for the combos
var g_comboLogos = {
	isOn : []
};
/*
	Desides what to do with each combo
*/
g_comboLogos.checkCombos = function () {

	var arrayLength = this.isOn.length;
	var plats = g_PLATS_GONE_IN_COMBO;
	var currentNotification = {name:"",scale:1};
	var shouldDraw = false;
	
	//Desides what to do dependant on how many
	//platforms are in the combo
	if (plats>5 && plats<=14) {
		currentNotification.name = "GOOD";
		currentNotification.scale = 0.3;
		shouldDraw = this.ifDoesntExist(1);
		g_FIREBOLTS = 6;
		
	}
	if (plats>14 && plats<=24) {
		currentNotification.name = "SWEET";
		currentNotification.scale = 0.3;
		g_SCORE_MULTIPLIER =2;
		shouldDraw = this.ifDoesntExist(2);
		g_FIREBOLTS = 10;
		
	}
	if (plats>24 && plats<=34) {
		currentNotification.name = "GREAT";
		currentNotification.scale = 0.3;
		shouldDraw = this.ifDoesntExist(3);
		g_FIREBOLTS = 15;
		
	}
	if (plats>34 && plats<=50) {
		currentNotification.name = "SUPER";
		currentNotification.scale = 0.3;
		g_SCORE_MULTIPLIER =3;
		shouldDraw = this.ifDoesntExist(4);
		g_FIREBOLTS = 20;
		
	}
	if (plats>50 && plats<=70) {
		currentNotification.name = "WOW";
		currentNotification.scale = 0.4;
		shouldDraw = this.ifDoesntExist(5);
	}
	if (plats>70 && plats<=100) {
		currentNotification.name = "AMAZING";
		currentNotification.scale = 0.4;
		g_SCORE_MULTIPLIER =4;
		shouldDraw = this.ifDoesntExist(6);
		
	}
	if (plats>100 && plats<=140) {
		currentNotification.name = "EXTREME";
		currentNotification.scale = 0.4;
		shouldDraw = this.ifDoesntExist(7);
		g_FIREBOLTS = 30;
		
	}
	if (plats>140 && plats<=180) {
		currentNotification.name = "FANTASTIC";
		currentNotification.scale = 0.4;
		g_SCORE_MULTIPLIER =6;
		shouldDraw = this.ifDoesntExist(8);
		g_FIREBOLTS = 40;
		
	}
	if (plats>180 && plats<=220) {
		currentNotification.name = "SPLENDID";
		currentNotification.scale = 0.4;
		g_SCORE_MULTIPLIER =8;
		shouldDraw = this.ifDoesntExist(9);
		
	}
	if (plats>220) {
		g_SCORE_MULTIPLIER =10;
		currentNotification.name = "NOWAY";
		currentNotification.scale = 0.5;
		shouldDraw = this.ifDoesntExist(10);
		g_FIREBOLTS = 50;
		
	}
	//Resets the combo
	if (!g_COMBO) {
		this.isOn = [];
		g_SCORE_MULTIPLIER =1;
	}
	//Draws the combo (only once for each combo)
	if(shouldDraw) entityManager.generateNotification(currentNotification.name,currentNotification.scale);
}

/*
	Checks if combo notification has been sent
	before
*/
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
