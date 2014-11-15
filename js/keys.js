// =================
// KEYBOARD HANDLING
// =================



var keys = [];

function handleKeydown(evt) {
    //Prevent scrolling of the webpage on space or arrow buttons
    if([32, 37, 38, 39, 40].indexOf(evt.keyCode) > -1) evt.preventDefault();
    keys[evt.keyCode] = true;

    
}

function handleKeyup(evt) {
    keys[evt.keyCode] = false;
}

// Inspects, and then clears, a key's state
//
// This allows a keypress to be "one-shot" e.g. for toggles
// ..until the auto-repeat kicks in, that is.
//
function eatKey(keyCode) {
    var isDown = keys[keyCode];
    keys[keyCode] = false;
    return isDown;
}

// A tiny little convenience function
function keyCode(keyChar) {
    return keyChar.charCodeAt(0);
}

window.addEventListener("keydown", handleKeydown,false);
window.addEventListener("keyup", handleKeyup);
