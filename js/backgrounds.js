

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
	if (gameOver && !g_menu.gameStarted && !g_MENU_SCREEN){
        g_background.cy = 0;
        g_background.cx = 0;
    }
    if (gameOver) {
		currentSprite = g_sprites.backgroundMenu;
	}
    if (!gameOver) {
        currentSprite = g_sprites.gameBackground;
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

g_background.update = function(du) { 

    //backgroundPic() === g_sprites.backgroundMenu
    //backgroundPic() === g_sprites.gameBackground
    if (gameOver && g_MENU_SCREEN) {
        this.cx -=this.speed*du;
    }

    if (!gameOver && !g_MENU_SCREEN && g_GAME_HEIGHT>0) {
        this.cy +=this.speed*du;
    }
}
