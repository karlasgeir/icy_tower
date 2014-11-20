
var g_menu = {
	gameStarted: false	
}
var ENTER_KEY = 13; //The key code for enter
var BLINK_COUNTDOWN = -1;
var BLINK_RATE = 3*NOMINAL_UPDATE_INTERVAL;
var isRed = false;
g_menu.update = function(du){
	//If we are at the menu screen
	if(g_MENU_SCREEN){
		//check if mouse is clicked and in the right place
		//Or if the enter key is pushed
		if(util.isInside(g_mouse.x,g_mouse.y,278,519,310,370)){
			this.activeSprite = g_sprites.menu.start.hover;
	    	if (g_mouse.Down ||eatKey(ENTER_KEY)) {
	    		//Make sure the mouse click is one shot
	    		g_mouse.Down=false;
	    		//Start the game
	        	g_menu.startGame();
	    	}
	    }
	    else this.activeSprite = g_sprites.menu.start.normal;
    }
    //check if mouse is clicked and in the right place
	//Or if the enter key is pushed

    else{ 
    	if(BLINK_COUNTDOWN === -1) this.gameOverSprite = g_sprites.menu.gameOver.normal;
    	if(BLINK_COUNTDOWN < BLINK_RATE){
    		BLINK_COUNTDOWN += du;
    	}
    	else{
    		BLINK_COUNTDOWN = 0;
    		if(isRed) this.gameOverSprite = g_sprites.menu.gameOver.normal;
    		else this.gameOverSprite = g_sprites.menu.gameOver.hover;
    		isRed = !isRed;
    	}
    	if (util.isInside(g_mouse.x,g_mouse.y,255,542,270,330)){
    		this.activeSprite = g_sprites.menu.mainMenu.hover;
	    	if(g_mouse.Down||eatKey(ENTER_KEY)){
				//Make sure the mouse click is one shot
		    	g_mouse.Down=false;    
		    	//Go to the start screen
		        g_MENU_SCREEN=!g_MENU_SCREEN;          
	    	}
	    }
	    else this.activeSprite = g_sprites.menu.mainMenu.normal;
    }
}

/*
	This function desides which menu to render
*/
g_menu.render = function(ctx){
	if (g_MENU_SCREEN) this.renderMenu(ctx); 
    else
        this.renderGameOver(ctx);
}
/*
	This function renders the start menu
*/
var SPACE_BETWEEN_TEXT = 30;
g_menu.renderMenu = function(ctx) {
	//g_sound.intro.play();
	var startGamePosX = g_canvas.width/2 - g_sprites.menu.start.normal.width/2;
	var startGamePosY = g_canvas.height/2 - g_sprites.menu.start.normal.height/2+SPACE_BETWEEN_TEXT;

	var logoPosX = g_canvas.width/2 - g_sprites.menu.logo.width/2;
	var logoPosY = startGamePosY - SPACE_BETWEEN_TEXT - g_sprites.menu.logo.height;
	
	this.activeSprite.drawAt(ctx, startGamePosX, startGamePosY,0);
	g_sprites.menu.logo.drawAt(ctx, logoPosX, logoPosY, 0);
}

/*
	This function renders the Game Over menu
*/
g_menu.renderGameOver = function(ctx) {
		var mainMenuPosX = g_canvas.width/2 - g_sprites.menu.mainMenu.normal.width/2;
		var mainMenuPosY = g_canvas.height/2 - g_sprites.menu.mainMenu.normal.height/2;

		var scorePosX = g_canvas.width/2 - g_sprites.menu.score.width/2 - g_SCORE.getWidth()/2;
		var scorePosY = mainMenuPosY + g_sprites.menu.score.height;

		var gameOverPosX = g_canvas.width/2 - g_sprites.menu.gameOver.normal.width/2;
		var gameOverPosY = mainMenuPosY - g_sprites.menu.gameOver.normal.height;

		this.gameOverSprite.drawAt(ctx, gameOverPosX, gameOverPosY, 0);
		this.activeSprite.drawAt(ctx, mainMenuPosX, mainMenuPosY,0);
		g_sprites.menu.score.drawAt(ctx, scorePosX, scorePosY, 0);
		g_SCORE.renderFinalScore(ctx,scorePosX + g_sprites.menu.score.width,scorePosY+g_sprites.menu.score.height/2);		
} 

g_menu.startGame = function(){
	g_GAME_TOP_HEIGHT = 0;
    entityManager.init();
    g_sound.gameGreeting.play();
    g_MENU_SCREEN=!g_MENU_SCREEN;
    gameOver = !gameOver;
}



