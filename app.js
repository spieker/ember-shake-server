let Shakes = require('./lib/shakes.js');
var app    = require('express')();
var server = require('http').createServer(app);
var io     = require('socket.io')(server);

let shakes = new Shakes();

shakes.on('match', function(a, b) {
  try {
    a.client.emit('match', b.data);
    b.client.emit('match', a.data);
  } catch(e) {
    // Most properly one client is disconnected ;(
  }
});

io.sockets.on('connection', function (client) {
  client.on('send', function (data) {
    shakes.push(client, data);
  });

  client.on('disconnect', function() {
    shakes.removeClient(client);
  });
});

server.listen(3000);
