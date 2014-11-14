
var g_mDown=false, g_mX=0, g_mY=0;

function handleMousedown(evt) {

    g_mX = event.pageX - g_canvas.offsetLeft;
    g_mY = event.pageY - g_canvas.offsetTop;
    g_mDown=true;

    if (gameOver && g_MENU_SCREEN) {
        //console.log('x: '+g_mX);
        //console.log('y: '+g_mY);

        if ((g_mX>=180 && g_mX<=417) && (g_mY>=270 && g_mY<=328)) {
            g_GAME_TOP_HEIGHT = 0;
            if (g_menu.gameStarted) {
                entityManager._generateInitialPlatforms();
            }
            g_MENU_SCREEN=!g_MENU_SCREEN;
            gameOver = !gameOver;
        }
    }


    if (gameOver && !g_MENU_SCREEN) {
        if ((g_mX>=190 && g_mX<=410) && (g_mY>=370 && g_mY<=420)) {    
            g_MENU_SCREEN=!g_MENU_SCREEN;          
        }
    }

    else {return;}
}

window.addEventListener("mousedown", handleMousedown);