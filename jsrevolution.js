var frame = 0; // game "frame" counter
var arrow_spawn_rate = 80; // how many frames until we spawn an arrow
var arrow_speed = 5;
var $stage;
var arrows = [];

// 60fps
function gameLoop () {
  
  // spawn an arrow
  if(frame++ % arrow_spawn_rate == 0){
    spawnArrow();
  }

  for (var i = arrows.length - 1; i >= 0; i--) {
    arrows[i].step();

    // CLEANUP
    if(arrows[i].img.position().top < 0){
      var del = arrows[i];
      arrows.splice(i,1);
      del.destroy();

      console.log(arrows.length);
      
    }
  } 
}

function spawnArrow() {
  
  // create an arrow object
  var direction = "u";
  var arrow = new Arrow(direction);
  arrows.push(arrow);

  $stage.append(arrow.img);

}






$(function(){

  // instantiate objects
  $stage = $("#stage");

  // game loop
  // shim layer with setTimeout fallback
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();


  // usage:
  // instead of setInterval(render, 16) ....

  (function animloop(){
    requestAnimFrame(animloop);
    gameLoop();
  })();

  // move arrows up

  // put arrows on stage

  // arrow listeners
  $(document).keyup(function(event){
    if(event.keyCode== 40 ){ // down
      console.log("down");
    }
    if(event.keyCode ==38){ // up
      console.log("up");
    }
    if(event.keyCode == 37){ // left
      console.log("left");
    }
    if(event.keyCode == 39){ // right
      console.log("right");
    }
  });

});



/*

  CLASSES

*/

//                 |---- must be u,d,l,r 
//                 v
function Arrow(direction){

  this.img = $("<img src='images/"+direction+".png'>");
  this.img.css({
    position:"absolute",
    top: "560px"
  });

  // random x position


}
Arrow.prototype.step = function() {
  this.img.css('top','-='+arrow_speed+'px');  
};
Arrow.prototype.destroy = function () {
  this.img.remove();
}



