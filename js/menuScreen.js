

var g_menu = {
	cx: 160,
	cy: 220,
	width: 300,
	height: 50,
	gameStarted: false
}

var g_notification = {

	cx: -180,
	cy: 260,
	speed : 3,
	width: 150,
	height: 50
}


g_menu.render = function(ctx) {

	ctx.beginPath();
	if (gameOver) {
		g_notification.cx = -180; 
		ctx.fillStyle = "white";
		ctx.fillRect(this.cx, this.cy,this.width, this.height);
		ctx.fillRect(this.cx+70, this.cy+65,this.width/2, this.height);
		ctx.font="bold 30px Arial";
		ctx.fillStyle = "black";
		ctx.fillText("I C Y  -  T O W E R",this.cx+20,this.cy+38);
		ctx.font="bold 20px Arial";
		ctx.fillText("S T A R T",this.cx+95,this.cy+100);
	}
	ctx.closePath();
}

g_notification.render = function(ctx) {

	if (!gameOver) {

		ctx.fillStyle = "blue";
		ctx.fillRect(this.cx, this.cy,this.width, this.height);
		ctx.fillStyle = "white";
		ctx.font="bold 40px Arial";
		ctx.fillText("G O",this.cx+35,300);
		g_menu.gameStarted = true;
	}
}


g_notification.update = function (du) {
	
	//animated level notification
	if (this.cx > 600) {
		return;
	}
	this.cx +=this.speed*du;
}


