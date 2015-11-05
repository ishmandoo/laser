function startup() {
  socket = io();

  canvas = document.getElementById("canvas");
  canvas.width = document.body.clientWidth; //document.width is obsolete
  canvas.height = document.body.clientHeight; //document.height is obsolete
  canvas_w = canvas.width;
  canvas_h = canvas.height;

  var ctx = canvas.getContext("2d");
  ctx.font = "50px Arial"
  ctx.fillText("Touch Me",canvas_w/2-115,canvas_h/2-25);

  canvas.addEventListener("touchstart", handleMove, false);
  canvas.addEventListener("touchend", handleEnd, false);
  canvas.addEventListener("touchmove", handleMove, false);

  console.log("initialized.");
}

function handleMove(evt){
  evt.preventDefault();

  console.log("touchstart.");
  var touch = evt.changedTouches[0];
  var pos = {x: touch.pageX/canvas_w, y: touch.pageY/canvas_h};

  socket.emit('new pos', pos);
}

function handleEnd(evt){
  evt.preventDefault();

  socket.emit('no touch');
}
