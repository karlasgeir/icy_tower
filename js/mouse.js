
var g_mDown=false, g_mX=0, g_mY=0;

function handleMousedown(evt) {

    if (gameOver) {
        g_mX = event.pageX - g_canvas.offsetLeft;
        g_mY = event.pageY - g_canvas.offsetTop;
        g_mDown=true;
        //console.log('x: '+g_mX);
        //console.log('y: '+g_mY);

        if ((g_mX>=220 && g_mX<=370) && (g_mY>=285 && g_mY<=338)) {
            g_GAME_TOP_HEIGHT = 0;
            if (g_menu.gameStarted) {
                entityManager._generateInitialPlatforms();
            }
            gameOver = !gameOver;
        }
    }
    else {return;}
}

window.addEventListener("mousedown", handleMousedown);