var io = require('socket.io-client');
var tracer = require('tracer').colorConsole({
	level: 'debug'
});

var socket = io.connect('http://localhost:1337', {
	query: 'username=player1'
});

socket.on('handshake', function(data) {
	tracer.info(data);
});

socket.on('test_event', function(data) {
	tracer.debug(data);
});

