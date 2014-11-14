
var g_notification = {

	cx: g_canvas.width,
	cy: g_canvas.height/2,
	timeInMiddle: 600/NOMINAL_UPDATE_INTERVAL,
	rotation: 0,
	speed : 3
}

var g_menu = {
	gameStarted: false
}

var g_gameover = {
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
		g_sprites.go.drawCentredAt(ctx, this.cx, this.cy, this.rotation);
	}
}


g_notification.update = function (du) {

	console.log(this.timeInMiddle);
	if (gameOver || g_MENU_SCREEN) {
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


g_gameover.render = function(ctx) {

	
	if (gameOver && !g_MENU_SCREEN ) {

		var mainMenuPosX = g_canvas.width/2 - g_sprites.mainMenu.width/2;
		var mainMenuPosY = g_canvas.height/2 - g_sprites.mainMenu.height/2;

		var scorePosX = g_canvas.width/2 - g_sprites.score.width/2;
		var scorePosY = mainMenuPosY + g_sprites.score.height;

		var gameOverPosX = g_canvas.width/2 - g_sprites.gameOver.width/2;
		var gameOverPosY = mainMenuPosY - g_sprites.gameOver.height;

		g_sprites.gameOver.drawAt(ctx, gameOverPosX, gameOverPosY, 0);
		g_sprites.mainMenu.drawAt(ctx, mainMenuPosX, mainMenuPosY,0);
		g_sprites.score.drawAt(ctx, scorePosX, scorePosY, 0);	
	}
	
} 


