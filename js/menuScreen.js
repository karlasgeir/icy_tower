

var g_menu = {
	cx: 230,
	cy: 270,
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

		g_notification.cx = -180; 

		var startGamePosX = g_canvas.width/2 - g_sprites.startGame.width/2;
		var startGamePosY = g_canvas.height/2 - g_sprites.startGame.height/2;

		var logoPosX = g_canvas.width/2 - g_sprites.logo.width/2;
		var logoPosY = startGamePosY - g_sprites.logo.height;

		g_sprites.startGame.drawAt(ctx, startGamePosX, startGamePosY,0);
		g_sprites.logo.drawAt(ctx, logoPosX, logoPosY, 0);

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


