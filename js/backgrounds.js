

var g_background =  {

    cx : 0,
    cy : 0,
    width: 600,
    height: 600
}

backgroundPic = function() {
	var currentSprite;
	//set our background image based on level
	if (gameOver) {
		currentSprite = g_sprites.backgroundMenu;
	}
    
    return currentSprite; 
};


g_background.render = function(ctx) {

    var sprite = backgroundPic();
    sprite.drawAt(ctx, this.cx, this.cy, 0);
    sprite.drawAt(ctx, this.width-Math.abs(this.cx), this.cy, 0);

    if (Math.abs(this.cx)>this.width) {
        this.cx = 0;
    }
}

g_background.update = function(du) { 

    if (gameOver) {
        this.cx -=0.25;
    }
}

//(ctx, this.cx, this.cy,this.rotation);

//image, width, height, x,y