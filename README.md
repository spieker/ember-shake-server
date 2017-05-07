# ember-shake

Ember shake lets you share contact information by shaking your phone. The client
is an ember application running in the browser, detecting shake events and
sending data to the server.

This repo contains the server part of ember-shake. It's providing a Socket.io
endpoint the client can connect to and send and receive events. The server
accepts `shake` events, is storing them for a short time and matches new events
against all stored once. As soon as a new `shake` event is received and a match
was found, the server responds with a `match` event to both matching clients,
containing the opponents shake data.

The data sent to the server as a `shake` event must contain the `latitude` and
`longitude` of the client.

```json
{ "latitude": 0.0, "longitude": 0.0, "something": "data" }
```

The server is publicly accessible and running on https://ember-shake.herokuapp.com/ .

## Example

```js
const client = require('socket.io-client')
const socket = client('https://ember-shake.herokuapp.com/');

socket.on('connect', function() {
  console.log('Connected')
});

socket.on('match', function(data) {
  console.log('Match', data)
});

socket.on('disconnect', function() {
  console.log('Disconnected')
});

socket.emit('shake', { longitude: 0.0, latitude: 0.0, data: 'whatever' });
```

Open two node CLIs add this code and you will receive a match on both of it if
you are fast enough ;).
