// ============
// SPRITE STUFF
// ============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// Construct a "sprite" from the given `image`,
//
function Sprite(image, width, height, x,y) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.scale = 1;
}

Sprite.prototype.drawAt = function (ctx, x, y,rotation) {
    if (rotation === undefined) rotation = 0;

    var w = this.width,
        h = this.height;
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(rotation);
    ctx.translate(-x,-y)
    ctx.scale(this.scale, this.scale);
    ctx.drawImage(this.image,this.x,this.y, w,h,x,y,w,h);
    ctx.restore();
};

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation) {
    if (rotation === undefined) rotation = 0;
    
    var w = this.width,
        h = this.height;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(this.scale, this.scale);
    ctx.translate(-cx,-cy);
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    ctx.drawImage(this.image, this.x,this.y,w,h,
                  cx-w/2, cy-h/2,w,h);
    
    ctx.restore();
};  

Sprite.prototype.drawWrappedCentredAt = function (ctx, cx, cy, rotation) {

  if (rotation === undefined) rotation = 0;

    var centerX = cx % g_canvas.width ;
    var centerY = cy % g_canvas.height ;
     
    this.drawCentredAt(ctx,centerX, centerY,rotation);
   
    if(centerX - this.width < 0){  
        this.drawCentredAt(ctx,centerX+g_canvas.width, centerY,rotation);
    }
    else if(centerX+this.width > g_canvas.width){    
        this.drawCentredAt(ctx,centerX-g_canvas.width, centerY,rotation);
    }
    else if(centerY - this.height < 0){
        this.drawCentredAt(ctx,centerX, centerY+g_canvas.height,rotation);
    }
    else if(centerY+this.height > g_canvas.height){    
        this.drawCentredAt(ctx,centerX, centerY-g_canvas.height,rotation);
    } 
    
      this.drawCentredAt(ctx,centerX+g_canvas.width, centerY-g_canvas.height,rotation);
    
        this.drawCentredAt(ctx,centerX+g_canvas.width, centerY+g_canvas.height,rotation);
        this.drawCentredAt(ctx,centerX-g_canvas.width, centerY-g_canvas.height,rotation);
        this.drawCentredAt(ctx,centerX-g_canvas.width, centerY+g_canvas.height,rotation);
};

