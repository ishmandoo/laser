var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/html/index.html');
});

app.use('/js', express.static(__dirname + '/client/js'));


io.on('connection', function(socket){
  console.log('a user connected');
  socket.pos = {x: 0, y:0}
  socket.touching = false;
  socket.updateTime = 0;


  socket.on('new pos', function (pos) {
    console.log(pos);
    socket.pos = pos;
    socket.touching = true;
    var date = new Date();
    socket.update_time = date.getTime();
    socket.broadcast.emit('broadcast pos', getPos());
  });

  socket.on('no touch', function (data) {
    console.log("no touch");
    socket.touching = false;
  });
});

app.get('/location', function(req, res){
  //res.send(pos.x + ',' + pos.y);
  res.json(getPos());
});

function getPos() {
  var pos = {x: 0, y: 0}
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
}

var server = http.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
