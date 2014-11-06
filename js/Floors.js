// ===============
// Floors STUFF
// ===============
"use strict";
/* jshint browser: true, devel: true, globalstrict: true */
// A generic contructor which accepts an arbitrary descriptor object
function Floors(descr) {
       for (var property in descr) {
        this[property] = descr[property];
    }
   





Floors.prototype.collides = function(){



 } 






Floors.prototype.update = function (du) {    

};





Floors.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    
    this.halt();
};



Floors.prototype.render = function (ctx) {
 //Keyra ut array
};





    
}
