const ShakeList = require('./lib/shakes.js');
const express   = require('express');
const SocketIO  = require('socket.io');

const HOST   = process.env.HOST || '0.0.0.0';
const PORT   = process.env.PORT || 3000;
const server = express()
               .listen(PORT, HOST, () => console.log(`Listening on ${HOST}:${PORT}`));

const io = SocketIO(server);

let shakeList = new ShakeList();

shakeList.on('match', function(a, b) {
  try {
    console.log('Match found!');
    a.client.emit('match', b.data);
    b.client.emit('match', a.data);
  } catch(e) {
    // Most properly one client is disconnected ;(
  }
});

io.sockets.on('connection', function (client) {
  client.on('send', function (data) {
    console.log('Received shake ...');
    shakeList.push(client, data);
  });

  client.on('disconnect', function() {
    console.log('Client disconnected');
    shakeList.removeClient(client);
  });
});
