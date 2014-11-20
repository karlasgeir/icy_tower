"use strict";

/*
    Holds the mouse position and 
    a variable to tell if the button
    is down
*/
var g_mouse = {
    Down:false,
    x:0,
    y:0
};

/*
    Function to handle mouse down click events
*/
g_mouse.handleMousedown = function(evt) {
    g_mouse.x = evt.pageX - g_canvas.offsetLeft;
    g_mouse.y = evt.pageY - g_canvas.offsetTop;
    g_mouse.Down=true;
};
/*
    Function to handle mouse up click events
*/
g_mouse.handleMouseup = function(evt) {
    g_mouse.x = evt.pageX - g_canvas.offsetLeft;
    g_mouse.y = evt.pageY - g_canvas.offsetTop;
    g_mouse.Down=false
};

/*
    Function to handle mouse movement events
*/
g_mouse.handleMousemove = function(evt){
    g_mouse.x = evt.pageX - g_canvas.offsetLeft;
    g_mouse.y = evt.pageY - g_canvas.offsetTop;
}


//Event listeners
window.addEventListener("mousedown", g_mouse.handleMousedown);
window.addEventListener("mouseup",g_mouse.handleMouseup);
window.addEventListener("mousemove",g_mouse.handleMousemove);