
socket = io();


active = false;
touched = true;

function startup() {

  canvas = document.getElementById("canvas");
  canvas.width = document.body.clientWidth; //document.width is obsolete
  canvas.height = document.body.clientHeight; //document.height is obsolete
  canvas_w = canvas.width;
  canvas_h = canvas.height;

  ctx = canvas.getContext("2d");

  canvas.addEventListener("touchstart", handleMove, false);
  canvas.addEventListener("touchend", handleEnd, false);
  canvas.addEventListener("touchmove", handleMove, false);

  console.log("initialized");
}

function handleMove(evt){
  console.log("touchstart.");
  evt.preventDefault();

  touched = true;
  if (!socket.connected) {
    socket.io.connect();
  }

  var touch = evt.changedTouches[0];
  var pos = {x: touch.pageX/canvas_w, y: touch.pageY/canvas_h};


  if (active) {
    socket.emit('new pos', pos);
  }
}

function handleEnd(evt){
  console.log("handle end");
  evt.preventDefault();

  socket.emit('no touch');
}

socket.on('deactivate', function(msg){
  console.log('deactivate');

  if (!touched) {
    socket.io.disconnect();

    ctx.fillStyle="#FF0000";
    ctx.fillRect(0,0,canvas_w,canvas_h);


    ctx.fillStyle="#000000";
    ctx.font = "50px Arial"
    ctx.fillText("Still here?",canvas_w/2-125,canvas_h/2-25);
    ctx.fillText("Touch for a turn",canvas_w/2-195,canvas_h/2+25);
  } else {

    ctx.fillStyle="#FFFF00";
    ctx.fillRect(0,0,canvas_w,canvas_h);


    ctx.fillStyle="#000000";
    ctx.font = "50px Arial"
    ctx.fillText("Just a sec...",canvas_w/2-125,canvas_h/2-25);
  }

  active = false;
});

socket.on('activate', function(msg){
  console.log('activate');
  active = true;
  touched = false;

  ctx.fillStyle="#00FF00";
  ctx.fillRect(0,0,canvas_w,canvas_h);


  ctx.fillStyle="#000000";
  ctx.font = "50px Arial"
  ctx.fillText("Your turn!",canvas_w/2-115,canvas_h/2-25);
});

socket.on('broadcast pos', function(pos){
  ctx.fillStyle="#000000";
  ctx.fillRect(pos.x*canvas_w,pos.y*canvas_h,7,7);
});
/*
$(window).blur(function() {
});

$(window).focus(function() {
});
*/


document.addEventListener("visibilitychange", function() {
  if (!document.hidden) {
    console.log("visible")
    socket.io.connect();
  } else {
    console.log("hidden")
    socket.io.disconnect();
  }
});
