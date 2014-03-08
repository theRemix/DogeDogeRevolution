var frame = 0; // game "frame" counter
var arrow_spawn_rate = 50; // how many frames until we spawn an arrow
var arrow_speed = 5;
var $stage;
var arrows = [];
var DIRECTIONS = ["u","d","l","r"];
var TARGET_POSITION = 20;
var TARGET_BAD = 40; // away from TARGET_POSITION
var TARGET_GOOD = 20; 
var TARGET_PERFECT = 5;

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
      missed();
    }
  } 
}

function missed () {
  console.log("MISSED");
}

function spawnArrow() {
  
  // create an arrow object
  var direction = DIRECTIONS[Math.floor(Math.random()*4)];
  var arrow = new Arrow(direction);
  arrows.push(arrow);

  $stage.append(arrow.img);

}

function asplodeArrow (arrow) {
  if(arrow.img.position().top > TARGET_POSITION-TARGET_PERFECT &&
     arrow.img.position().top < TARGET_POSITION+TARGET_PERFECT){
    // PERFECT!
    console.log("PERFECT");
  }else if(arrow.img.position().top > TARGET_POSITION-TARGET_GOOD &&
           arrow.img.position().top < TARGET_POSITION+TARGET_GOOD){
    // GOOD
    console.log("GOOD");
  }else{
    console.log("BAD");
  }

  // ASPLODE
  for (var i = arrows.length - 1; i >= 0; i--) {
    if(arrows[i] == arrow){
      var del = arrows[i];
      arrows.splice(i,1);
      del.destroy();  
    }
  };

}

// these are all within BAD range
function checkArrowPress (event, arrow) {
  if(
    (event.keyCode == 40 && arrow.direction == "d") ||
    (event.keyCode == 38 && arrow.direction == "u") ||
    (event.keyCode == 37 && arrow.direction == "l") ||
    (event.keyCode == 39 && arrow.direction == "r")
    )
  {
    asplodeArrow(arrow);
  }
}




$(function(){

  // instantiate objects
  $stage = $("#stage");
  $control_arrow_u = $('#control_arrow_u');
  $control_arrow_d = $('#control_arrow_d');
  $control_arrow_l = $('#control_arrow_l');
  $control_arrow_r = $('#control_arrow_r');

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

    // check if any arrow is within 40px of the target position
    for (var i = arrows.length - 1; i >= 0; i--) {
      if(arrows[i].img.position().top < TARGET_POSITION+TARGET_BAD){
        checkArrowPress(event, arrows[i]);
      }
    };

  });

});



/*

  CLASSES

*/

//                 |---- must be u,d,l,r 
//                 v
function Arrow(direction){
  this.direction = direction;

  var laneX;
  switch(direction){
    case "l":
      laneX = 60;
      break;
    case "r":
      laneX = 180;
      break;
    case "u":
      laneX = 300;
      break;
    case "d":
      laneX = 420;
      break;
  }

  this.img = $("<img src='images/"+direction+".gif'>");
  this.img.css({
    position:"absolute",
    top: "560px",
    left: laneX+"px"
  });

  // random x position


}
Arrow.prototype.step = function() {
  this.img.css('top','-='+arrow_speed+'px');  
};
Arrow.prototype.destroy = function () {
  this.img.remove();
}



