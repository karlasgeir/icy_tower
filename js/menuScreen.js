

var g_menu = {
	cx: 150,
	cy: 220,
	width: 300,
	height: 50
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
		
		ctx.fillStyle = "red";
		ctx.fillRect(this.cx, this.cy,this.width, this.height);
		ctx.fillRect(this.cx+70, this.cy+65,this.width/2, this.height);
		ctx.fillStyle="black";
		ctx.font="bold 30px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("I C Y  -  T O W E R",this.cx+15,this.cy+38);
		ctx.font="bold 20px Arial";
		ctx.fillText("S T A R T",this.cx+95,this.cy+100);
	}
	ctx.closePath();
}

g_notification.render = function(ctx) {

	if (!gameOver) {

		ctx.fillStyle = "red";
		ctx.fillRect(this.cx, this.cy,this.width, this.height);
		ctx.fillStyle = "white";
		ctx.font="bold 40px Arial";
		ctx.fillText("G O",this.cx+35,300);
	}
}


g_notification.update = function (du) {
	
	//animated level notification
	if (this.cx > 600) {
		return;
	}
	this.cx +=this.speed*du;
}


