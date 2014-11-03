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

    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    ctx.drawImage(this.image, this.x,this.y,w,h,
                  -w/2, -h/2,w,h);
    
    ctx.restore();
};  
