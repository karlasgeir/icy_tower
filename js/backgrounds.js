

var g_background =  {

    cx : 0,
    cy : 0,
    width: 600,
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
        currentSprite = g_sprites.gameBackground;
    }
    return currentSprite; 
};


g_background.render = function(ctx) {

    var sprite = backgroundPic();

    if (gameOver) {
        sprite.drawAt(ctx, this.cx, this.cy, 0);
        sprite.drawAt(ctx, this.width-Math.abs(this.cx), this.cy, 0);

        if (Math.abs(this.cx)>this.width) {
            this.cx = 0;
        }
    }
    if (!gameOver) {
        sprite.drawAt(ctx, this.cx, this.cy, 0);
        sprite.drawAt(ctx, this.cx, Math.abs(this.cy)-this.height, 0);

        if (Math.abs(this.cy)>this.height) {
            this.cy = 0;
        }
    }
}

g_background.update = function(du) { 

    if (gameOver && g_MENU_SCREEN && backgroundPic() === g_sprites.backgroundMenu) {
        this.cx -=0.25*du;
    }

    if (!gameOver && !g_MENU_SCREEN && backgroundPic() === g_sprites.gameBackground) {
        this.cy +=this.speed*du;
    }
}
