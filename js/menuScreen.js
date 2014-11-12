

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


var g_gameover = {
	cx: 140,
	cy: 220,
	width: 360,
	height: 50,
	gameStarted:false
}


g_menu.render = function(ctx) {

	if (gameOver) {
		ctx.save();
		ctx.beginPath();
		g_notification.cx = -180; 
		ctx.fillStyle = "white";
		ctx.fillRect(this.cx, this.cy,this.width, this.height);
		ctx.fillRect(this.cx+70, this.cy+65,this.width/2, this.height);
		ctx.font="bold 30px Arial";
		ctx.fillStyle = "black";
		ctx.fillText("I C Y  -  T O W E R",this.cx+20,this.cy+38);
		ctx.font="bold 20px Arial";
		ctx.fillText("S T A R T",this.cx+95,this.cy+100);
		ctx.closePath();
		ctx.restore();
	}
}

g_notification.render = function(ctx) {

	if (!gameOver) {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = "blue";
		ctx.fillRect(this.cx, this.cy,this.width, this.height);
		ctx.fillStyle = "white";
		ctx.font="bold 40px Arial";
		ctx.fillText("G O",this.cx+35,300);
		g_menu.gameStarted = true;
		ctx.closePath();
		ctx.restore();
	}
}


g_notification.update = function (du) {
	
	//animated level notification
	if (this.cx > 600) {
		return;
	}
	this.cx +=this.speed*du;
}


g_gameover.render = function(ctx) {

	
	if (gameOver && !g_MENU_SCREEN ) {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle="#152775";
		ctx.fillRect(this.cx+50, this.cy+150,this.width-140, this.height);
		
		ctx.fillStyle="black";
		ctx.font="bold 50px SNOWCARD GOTHIC";
		ctx.fillStyle = "red";
		ctx.fillText("G A M E   O V E R",this.cx-40,this.cy);
		ctx.font="bold 20px Arial";
		ctx.fillText("Y O U   S C O R E D : "+ g_GAME_SCORE,this.cx+40,this.cy+62);
		ctx.fillText("M A I N   M E N U",this.cx+80,this.cy+180);
		ctx.closePath();
		ctx.restore();
	}
	
} 


