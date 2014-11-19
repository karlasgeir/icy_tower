
var g_menu = {
	gameStarted: false
}

var g_gameover = {
	gameStarted:false
}

var g_sound = {
		intro:new Audio("res/sounds/intro.wav")
}


g_menu.render = function(ctx) {

	if (gameOver) {
		g_sound.intro.play();
		var startGamePosX = g_canvas.width/2 - g_sprites.startGame.width/2;
		var startGamePosY = g_canvas.height/2 - g_sprites.startGame.height/2;

		var logoPosX = g_canvas.width/2 - g_sprites.logo.width/2;
		var logoPosY = startGamePosY - g_sprites.logo.height;

		g_sprites.startGame.drawAt(ctx, startGamePosX, startGamePosY,0);
		g_sprites.logo.drawAt(ctx, logoPosX, logoPosY, 0);

	}
}

g_gameover.render = function(ctx) {

	
	if (gameOver && !g_MENU_SCREEN ) {

		var mainMenuPosX = g_canvas.width/2 - g_sprites.mainMenu.width/2;
		var mainMenuPosY = g_canvas.height/2 - g_sprites.mainMenu.height/2;

		var scorePosX = g_canvas.width/2 - g_sprites.score.width/2 - g_SCORE.getWidth()/2;
		var scorePosY = mainMenuPosY + g_sprites.score.height;

		var gameOverPosX = g_canvas.width/2 - g_sprites.gameOver.width/2;
		var gameOverPosY = mainMenuPosY - g_sprites.gameOver.height;

		g_sprites.gameOver.drawAt(ctx, gameOverPosX, gameOverPosY, 0);
		g_sprites.mainMenu.drawAt(ctx, mainMenuPosX, mainMenuPosY,0);
		g_sprites.score.drawAt(ctx, scorePosX, scorePosY, 0);
		g_SCORE.renderFinalScore(ctx,scorePosX + g_sprites.score.width,scorePosY+g_sprites.score.height/2);	
	}
	
} 


