var Client = (function() {
	var toggleGameMode, connect, setupGame;
	var startBtn, gameEnded = false;

	toggleGameMode = function() {
		startBtn = startBtn || $('#start');
		startBtn.toggleClass('hidden');
	}

	connect = function(username, callback) {
		var socket = io.connect(host + '/defender', {
			query: 'username=' + username + '&clientHash=staticbound',
			'force new connection': true,
			reconnect: false,
			secure: secureClient
		});
		if (socket) {
			callback(socket);
		}
	}

	setupGame = function(socket, brain, commander) {
		toggleGameMode();
		gameEnded = false;
		socket
			.on('handshake', function(data) {
				Blabber.info(data.message);
			})
			.on('round', function(data) {
				var roundInfo, blabber;
				if (gameEnded) {
					return;
				}

				Blabber.info(sprintf('Round %s', data.round));

				roundInfo = new RoundInfo(data);
				blabber = new Blabber(roundInfo);

				blabber.displayPlayerHealth();
				if (data.insult) {
					Blabber.error(data.insult);
				}

				if (data.round !== 1){
					Blabber.info(sprintf('Targeting %s with %s attack mode.', commander.enemyTarget, commander.mode));
					blabber.displayPlayerActions();
					blabber.displayEnemyActions();
            	}
				brain.onRound(roundInfo);
				Blabber.debug('<br>');
			})
			.on('connect_failed', function(reason) {
				Blabber.error(reason);
			})
			.on('death', function(data) {
				Blabber.error(data.message);
				Blabber.debug(JSON.stringify(data.stats));
				socket.disconnect();
				toggleGameMode();
			})
			.on('disconnect', function() {
				gameEnded = true;
			});
	}

	return {
		start: function(username, code) {
			$('#consolelog').html('');
			connect(username, function(socket) {
				var commander = new Commander(socket);
				var brain = new Brain(commander);
				if (!brain.setStrategy(code)) {
					socket.disconnect();
					return;
				}
				setupGame(socket, brain, commander);
			});	
		}
	}
}());
