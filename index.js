var io = require('socket.io-client');
var tracer = require('tracer').colorConsole({
	level: 'debug',
    format : "{{message}}",
});

var defender = io.connect('http://localhost:1337/defender', {
	query: 'username=player1'
});

defender
	.on('handshake', function(data) {
		tracer.info(data);
	})
	.on('test_event', function(data) {
		tracer.debug(data);
	})
	.on('disconnect', function(data) {
		tracer.info('Disconnected: Thanks for playing.');
		process.exit();
	});
