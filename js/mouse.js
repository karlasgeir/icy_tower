var g_mouse = {
    Down:false,
    x:0,
    y:0
};


g_mouse.handleMousedown = function(evt) {
    g_mouse.x = evt.pageX - g_canvas.offsetLeft;
    g_mouse.y = evt.pageY - g_canvas.offsetTop;
    g_mouse.Down=true;
};

g_mouse.handleMouseup = function(evt) {
    g_mouse.x = evt.pageX - g_canvas.offsetLeft;
    g_mouse.y = evt.pageY - g_canvas.offsetTop;
    g_mouse.Down=false
};

g_mouse.handleMousemove = function(evt){
    g_mouse.x = evt.pageX - g_canvas.offsetLeft;
    g_mouse.y = evt.pageY - g_canvas.offsetTop;
}



window.addEventListener("mousedown", g_mouse.handleMousedown);
window.addEventListener("mouseup",g_mouse.handleMouseup);
window.addEventListener("mousemove",g_mouse.handleMousemove);