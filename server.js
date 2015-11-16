var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var pos = {x: 0, y: 0, users: 0}

var active_socket = false;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/html/index.html');
});

app.use('/js', express.static(__dirname + '/client/js'));


io.on('connection', function(socket){
  console.log('a user connected');
  socket.pos = {x: 0, y:0}
  socket.touching = false;
  socket.updateTime = 0;
  socket.active = false;
  socket.emit('deactivate');


  socket.on('new pos', function (pos) {
    console.log(pos);
    socket.pos = pos;
    socket.touching = true;
    var date = new Date();
    socket.update_time = date.getTime();
  });

  socket.on('no touch', function (data) {
    console.log("no touch");
    socket.touching = false;
  });

  socket.on('disconnect', function (data) {
    console.log("disconenct");
    if (socket.active) {
      chooseNew();
    }
  });
});



setInterval(function() {
  io.sockets.emit('broadcast pos', getPos());
}, 50);

setInterval(function() {
  chooseNew();
}, 5000);

function chooseNew() {
  console.log("Choosing a new user from " + io.sockets.sockets.length)
  if (active_socket) {
    active_socket.emit("deactivate");
    active_socket.active = false;
  }
  active_socket = io.sockets.sockets[Math.floor(Math.random()*io.sockets.sockets.length)];

  if (active_socket) {
    console.log(active_socket.id)
    active_socket.emit("activate");
    active_socket.activate = true;
  }
}


app.get('/location', function(req, res){
  //res.send(pos.x + ',' + pos.y);
  res.json(getPos());
});

function getPos() {
  pos.users = io.sockets.sockets.length;
  /*
  var x_sum = 0;
  var y_sum = 0;
  var n_touching = 0;


  var date = new Date();
  var time = date.getTime();

  if (io.sockets) {
    var sockets = io.sockets.sockets;

    for (i = 0; i < sockets.length; i++) {
      if ((sockets[i].touching) && (time - sockets[i].update_time < 10000)) {
        x_sum += sockets[i].pos.x;
        y_sum += sockets[i].pos.y;
        n_touching++;
      }
    }
  }

  if (n_touching > 0){
    pos = {x: x_sum/n_touching, y: y_sum/n_touching}
  }
  return pos;
  */
  if (active_socket) {
    pos.x = active_socket.pos.x;
    pos.y = active_socket.pos.y;
  }
  return pos;
}

var server = http.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
