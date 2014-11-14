
notificationSprite = function () {
	var currentNotification;
	/*
	IF COMBO equals 20
	currentNotification = correctSprite;
	etc.
	return currentNotification;
	*/
}


var g_notification = {

	cx: g_canvas.width,
	cy: g_canvas.height/2,
	timeInMiddle: 600/NOMINAL_UPDATE_INTERVAL,
	rotation: 0,
	speed : 3
}

g_notification.render = function(ctx) {

	if (!gameOver) {
		g_sprites.go.drawCentredAt(ctx, this.cx, this.cy, this.rotation);
	}
}


g_notification.update = function (du) {

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
	if (this.timeInMiddle <= 0 && this.cx<=g_canvas.width+g_sprites.go.width/2) {
		this.speed = 50;
		this.cx +=this.speed*du;
	}
}
