var Client = (function() {
	var consolelog, _commander, _brain, _roundInfo, log, activateStrategy;

	log = function(message) {
		consolelog.append('<p>' + message + '</p>');
	};
	activateStrategy = function(code) {

	}
	return {
		start: function(username, code) {
			var socket = io.connect(host + '/defender', {
				query: 'username=' + username + '&clientHash=staticbound',
				'force new connection': true,
				reconnect: false
			});
			_commander = new Commander(socket);
			_brain = new Brain(_commander);
			_brain.setStrategy(code);

			consolelog = $('#consolelog');
			$('#start').hide();
			$('#editor').hide();

			socket
				.on('handshake', function(data) {
					console.log(data);
				})
				.on('round', function(data) {
					var roundInfo = new RoundInfo(data);
					log('Round: ' + data.round);
					if (data.insult) {
						log(data.insult);
					}
					_brain.onRound(roundInfo);
				})
				.on('connect_failed', function(reason) {
					console.log(reason);
				})
				.on('death', function(data) {
					console.log(data);
					socket.disconnect();
				});
		}
	}
}());
