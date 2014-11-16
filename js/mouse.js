
var g_mDown=false, g_mX=0, g_mY=0;

function handleMousedown(evt) {

    g_mX = event.pageX - g_canvas.offsetLeft;
    g_mY = event.pageY - g_canvas.offsetTop;
    g_mDown=true;

    if (gameOver && g_MENU_SCREEN) {
        if ((g_mX>=278 && g_mX<=519) && (g_mY>=270 && g_mY<=330)) {
            g_GAME_TOP_HEIGHT = 0;
            entityManager.init();
            g_MENU_SCREEN=!g_MENU_SCREEN;
            gameOver = !gameOver;
        }
    }


    if (gameOver && !g_MENU_SCREEN) {
        if ((g_mX>=255 && g_mX<=542) && (g_mY>=270 && g_mY<=330)) {    
            g_MENU_SCREEN=!g_MENU_SCREEN;          
        }
    }

    else {return;}
}

window.addEventListener("mousedown", handleMousedown);