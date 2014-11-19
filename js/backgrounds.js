

var g_background =  {

    cx : 0,
    cy : 0,
    width: 800,
    speed : 0.25,
    height: 600
}

backgroundPic = function() {
	var currentSprite;
	//set our background image based on level

    if (gameOver) {
		currentSprite = g_sprites.backgroundMenu;
	}
    if (!gameOver) {
        var gravPowerup = entityManager._characters[0].gravityPowerup;
        var speedPowerup = entityManager._characters[0].speedPowerup;
       // console.log(entityManager._characters[0].gravityPowerup);
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


g_background.render = function(ctx) {

    var sprite = backgroundPic();

    if (gameOver) {
        sprite.drawStretchedAt(ctx,this.cx,this.cy,this.width,this.height);
        sprite.drawStretchedAt(ctx,this.width-Math.abs(this.cx),this.cy,this.width,this.height);

        if (Math.abs(this.cx)>this.width) {
            this.cx = 0;
        }
    }
    if (!gameOver) {

        this.cx = g_canvas.width/2-sprite.width/2; 
        sprite.drawAt(ctx, this.cx, this.cy, 0);
        sprite.drawAt(ctx, this.cx, Math.abs(this.cy)-this.height, 0);

        if (Math.abs(this.cy)>this.height) {
            this.cy = 0;
        }
    }
}
var prevGameOver = false;
g_background.update = function(du) { 
    
    if (gameOver && !prevGameOver){
        g_background.cy = 0;
        g_background.cx = 0;
        prevGameOver = true;
    }
    if(!gameOver){
        prevGameOver = false;
    }



    //backgroundPic() === g_sprites.backgroundMenu
    //backgroundPic() === g_sprites.gameBackground
    if (gameOver) {
        this.cx -=this.speed*du;
    }

    if (!gameOver && !g_MENU_SCREEN && g_GAME_HEIGHT>0) {
        this.cy +=this.speed*du;
    }
}
