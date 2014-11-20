//This holds functions and values 
//for the background
var g_background =  {

    cx : 0,
    cy : 0,
    width: 800,
    speed : 0.25,
    height: 600
}
/*
    Desides which background pick to use
*/
backgroundPic = function() {
	var currentSprite;
    if (gameOver) {
		currentSprite = g_sprites.backgroundMenu;
	}
    if (!gameOver) {
        var gravPowerup = entityManager._characters[0].gravityPowerup;
        var speedPowerup = entityManager._characters[0].speedPowerup;
        if (gravPowerup>0) {
            currentSprite = g_sprites.space;
        } else if (speedPowerup>0) {
            currentSprite = g_sprites.redBricks;
        } else {
            currentSprite = g_sprites.gameBackground;
        }
    }
    
    return currentSprite; 
};

/*
    Render the background
*/
g_background.render = function(ctx) {
    //Find the correct background picture
    var sprite = backgroundPic();
    //If it's game over we are sidescrolling the background
    if (gameOver) {
        sprite.drawStretchedAt(ctx,this.cx,this.cy,this.width,this.height);
        sprite.drawStretchedAt(ctx,this.width-Math.abs(this.cx),this.cy,this.width,this.height);
        if (Math.abs(this.cx)>this.width) {
            this.cx = 0;
        }
    }
    //If the game is on we are scrolling the background down
    if (!gameOver) {

        this.cx = g_canvas.width/2-sprite.width/2; 
        sprite.drawAt(ctx, this.cx, this.cy, 0);
        sprite.drawAt(ctx, this.cx, Math.abs(this.cy)-this.height, 0);

        if (Math.abs(this.cy)>this.height) {
            this.cy = 0;
        }
    }
}

/*
    This function upgrades the background
*/
var prevGameOver = false;
g_background.update = function(du) { 
    //Reset the position of the background
    if (gameOver && !prevGameOver){
        g_background.cy = 0;
        g_background.cx = 0;
        prevGameOver = true;
    }
    else if(!gameOver){
        prevGameOver = false;
    }
    //If it's game over the background is sidescrolling
    if (gameOver) {
        this.cx -=this.speed*du;
    }
    //If the game is on the background is scrolling down
    if (!gameOver && !g_MENU_SCREEN && g_GAME_HEIGHT>0) {
        this.cy +=this.speed*du;
    }
}
