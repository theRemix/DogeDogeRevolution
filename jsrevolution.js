var frame = 0; // game "frame" counter
var arrow_spawn_rate = 24; // how many frames until we spawn an arrow
var arrow_speed = 6;
var $stage,
    $perfect,
    $good,
    $bad,
    $missed,
    $alert_perfect,
    $alert_good,
    $alert_bad,
    $alert_missed;
var scores = {
  perfect : 0,
  good : 0,
  bad : 0,
  missed : 0
};
var SCORETYPE = {
  PERFECT : "PERFECT",
  GOOD : "GOOD",
  BAD : "BAD",
  MISSED : "MISSED"
}
var arrows = [];
var DIRECTIONS = ["u","d","l","r"];
var TARGET_POSITION = 20;
var TARGET_BAD = 40; // away from TARGET_POSITION
var TARGET_GOOD = 20; 
var TARGET_PERFECT = 10;
var STAGE_WIDTH = 500,
    STAGE_HEIGHT = 650;

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

function updateScore (scoreType) {
  switch(scoreType){
    case SCORETYPE.MISSED:
      scores.missed++;
      $missed.html(scores.missed);
      $alert_missed.css({ left : (Math.random()*STAGE_WIDTH)+"px", top : (Math.random()*STAGE_HEIGHT)+"px"}).show();
      $alert_bad.hide();
      $alert_good.hide();
      $alert_perfect.hide();
      break;
    case SCORETYPE.BAD:
      scores.bad++;
      $bad.html(scores.bad);
      $alert_bad.css({ left : (Math.random()*STAGE_WIDTH)+"px", top : (Math.random()*STAGE_HEIGHT)+"px"}).show();
      $alert_missed.hide();
      $alert_good.hide();
      $alert_perfect.hide();
      break;
    case SCORETYPE.GOOD:
      scores.good++;
      $good.html(scores.good);
      $alert_good.css({ left : (Math.random()*STAGE_WIDTH)+"px", top : (Math.random()*STAGE_HEIGHT)+"px"}).show();
      $alert_bad.hide();
      $alert_missed.hide();
      $alert_perfect.hide();
      break;
    case SCORETYPE.PERFECT:
      scores.perfect++;
      $perfect.html(scores.perfect);
      $alert_perfect.css({ left : (Math.random()*STAGE_WIDTH)+"px", top : (Math.random()*STAGE_HEIGHT)+"px"}).show();
      $alert_bad.hide();
      $alert_good.hide();
      $alert_missed.hide();
      break;
  }

}

function missed () {
  updateScore(SCORETYPE.MISSED);
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
    updateScore(SCORETYPE.PERFECT);

  }else if(arrow.img.position().top > TARGET_POSITION-TARGET_GOOD &&
           arrow.img.position().top < TARGET_POSITION+TARGET_GOOD){
    // GOOD
    updateScore(SCORETYPE.GOOD);
  }else{
    updateScore(SCORETYPE.BAD);
  }

  // ASPLODE
  for (var i = arrows.length - 1; i >= 0; i--) {
    if(arrows[i] == arrow){
      var del = arrows[i];
      arrows.splice(i,1);
      del.asplode();
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
  // $control_arrow_u = $('#control_arrow_u');
  // $control_arrow_d = $('#control_arrow_d');
  // $control_arrow_l = $('#control_arrow_l');
  // $control_arrow_r = $('#control_arrow_r');
  $perfect = $('#perfect span');
  $good = $('#good span');
  $bad = $('#bad span');
  $missed = $('#missed span');

  $alert_perfect = $('<img src="images/perfect.png" alt="" />').hide().css("position","absolute");
  $alert_good = $('<img src="images/good.png" alt="" />').hide().css("position","absolute");
  $alert_bad = $('<img src="images/bad.png" alt="" />').hide().css("position","absolute");
  $alert_missed = $('<img src="images/missed.png" alt="" />').hide().css("position","absolute");
  
  $stage.append($alert_perfect);
  $stage.append($alert_good);
  $stage.append($alert_bad);
  $stage.append($alert_missed);

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
  $(document).keydown(function(event){

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

  arrow -> Arrow
  arrow.direction
  arrow.img  -> $jq object
  arrow.step()
  arrow.destroy()
  arrow.asplode()


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

  this.img = $("<img src='images/"+direction+".png'>");
  this.img.css({
    position:"absolute",
    top: "560px",
    left: laneX+"px"
  });

}
Arrow.prototype.step = function() {
  this.img.css('top','-='+arrow_speed+'px');  
};
Arrow.prototype.destroy = function () {
  this.img.remove();
};
Arrow.prototype.asplode = function () {
  // show a temporary gif
  var explode = $("<img src='images/explode1.gif'>");
  explode.css({
    position:"absolute",
    top: this.img.position().top-20+"px",
    left: this.img.position().left-30+"px"
  });
  $stage.append(explode);

  setTimeout(function(){
    explode.remove();
  }, 450);
};



