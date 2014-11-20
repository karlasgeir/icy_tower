
var g_menu = {
	gameStarted: false,
	blinkCountdown: -1, //Countdown for the key
	blinkRate: 3*NOMINAL_UPDATE_INTERVAL, //rate of blink
}


var isRed = false; //Tells you if the blink is red
var ENTER_KEY = 13; //The key code for enter
g_menu.update = function(du){
	//If we are at the menu screen
	if(g_MENU_SCREEN){
		//Pressing enter starts the game
		if(eatKey(ENTER_KEY)) g_menu.startGame();
		//check if mouse is clicked and in the right place
		w=g_sprites.menu.start.normal.getWidth();
		h=g_sprites.menu.start.normal.getHeight();
		if(util.isInside(g_mouse.x,g_mouse.y,g_canvas.width/2-w/2,g_canvas.width/2+w/2,
			g_canvas.height/2,g_canvas.height/2+h)){
			this.activeSprite = g_sprites.menu.start.hover;
	    	if (g_mouse.Down ) {
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
    	//Press enter to move to menu screen
    	if(eatKey(ENTER_KEY))g_MENU_SCREEN=!g_MENU_SCREEN;
    	//Choose sprite for blink
    	if(this.blinkCountdown === -1) this.gameOverSprite = g_sprites.menu.gameOver.normal;
    	if(this.blinkCountdown < this.blinkRate){
    		this.blinkCountdown += du;
    	}
    	else{
    		this.blinkCountdown = 0;
    		if(isRed) this.gameOverSprite = g_sprites.menu.gameOver.normal;
    		else this.gameOverSprite = g_sprites.menu.gameOver.hover;
    		isRed = !isRed;
    	}
    	//check if mouse is clicked and in the right place
    	w=g_sprites.menu.mainMenu.normal.getWidth();
		h=g_sprites.menu.mainMenu.normal.getHeight();
    	if (util.isInside(g_mouse.x,g_mouse.y,g_canvas.width/2-w/2,g_canvas.width/2+w/2,
			g_canvas.height/2-h/2,g_canvas.height/2+h/2)){
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
	var posX = g_canvas.width/2;
	var startGamePosY = g_canvas.height/2 + g_sprites.menu.start.normal.getHeight()/2;

	var logoPosY = startGamePosY - SPACE_BETWEEN_TEXT - g_sprites.menu.logo.getHeight();
	
	this.activeSprite.drawCentredAt(ctx, posX, startGamePosY,0);
	g_sprites.menu.logo.drawCentredAt(ctx, posX, logoPosY, 0);
}

/*
	This function renders the Game Over menu
*/
g_menu.renderGameOver = function(ctx) {
	//Get main menu position
	var posX = g_canvas.width/2;
	var sprite = g_sprites.menu;

	var mainMenuPosY = g_canvas.height/2;
	//Get score position
	var scorePosX = g_canvas.width/2- g_SCORE.getWidth()/2;
	var scorePosY = mainMenuPosY + sprite.score.getHeight() + sprite.mainMenu.normal.getHeight()/2;
	//Get game over position
	var gameOverPosY = mainMenuPosY - sprite.gameOver.normal.getHeight() ;
	//Draw the sprites
	this.gameOverSprite.drawCentredAt(ctx, posX, gameOverPosY, 0);
	this.activeSprite.drawCentredAt(ctx, posX, mainMenuPosY,0);
	sprite.score.drawCentredAt(ctx, scorePosX, scorePosY, 0);
	g_SCORE.renderFinalScore(ctx,scorePosX+sprite.score.getWidth()/2,scorePosY);		
} 

/*
	This function starts a new game
*/
g_menu.startGame = function(){
	//Reset variables
    g_COMBO_PLAT_IDS = [];
    g_PLATS_IN_COMBO = [];
    g_COMBO = false;
    g_GAME_HEIGHT  = 0;
    g_FIREBOLTS = 0;
    g_SCORE = new Score();
    g_SCORE_MULTIPLIER = 1;
    g_VERTICAL_SPEED = 0.5;
	g_GAME_TOP_HEIGHT = 0;
	//Start initialize the entity manager
    entityManager.init();
    g_sound.gameGreeting.play();
    g_MENU_SCREEN=!g_MENU_SCREEN;
    gameOver = !gameOver;
}



