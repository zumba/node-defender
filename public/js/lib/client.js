/* globals ga, define */

define(
	['jquery', 'socketio', 'sprintf', 'blabber', 'gameboard', 'roundInfo', 'commander', 'brain'],
	function($, io, sprintf, Blabber, GameBoard, RoundInfo, Commander, Brain){
		var enableStart, disableStart, connect, setupGame, recover;
		var startBtn, inSession = false, gameEnded = false, _socket, _oauth;

		enableStart = function() {
			startBtn = startBtn || $('#start');
			if (!!startBtn.attr('disabled')) {
				startBtn.removeAttr('disabled');
			}
			inSession = false;
		};

		disableStart = function() {
			startBtn = startBtn || $('#start');
			startBtn.attr('disabled', 'disabled');
		};

		connect = function(username, callback) {
			var socket, query;
			query = 'username=' + username;
			if (_oauth) {
				query += '&token=' + _oauth.token + '&secret=' + _oauth.secret;
			}
			socket = io.connect(window.host + '/defender', {
				query: query,
				'force new connection': true,
				reconnect: false,
				secure: window.secureClient
			});
			if (socket) {
				callback(socket);
			}
		};

		setupGame = function(socket, brain, commander, gameBoard) {
			disableStart();
			gameEnded = false;
			_socket = socket;
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

					gameBoard.processRound(roundInfo, function() {
						brain.onRound(roundInfo);
						Blabber.debug('<br>');
					});
				})
				.on('connect_failed', function(reason) {
					Blabber.error(reason);
					recover();
				})
				.on('mandown', function(data) {
					Blabber.error(data.message);
					Blabber.info('<br>');
				})
				.on('death', function(data) {
					Blabber.error(data.message);
					Blabber.debug('Score: ' + data.stats.score);
					GameBoard.defeated();
					if (typeof ga === 'function') {
						ga('send', 'event', 'game', 'death', {
							'metric1': data.score,
							'metric2': data.kills
						});
					}
					socket.disconnect();
				})
				.on('disconnect', function() {
					Blabber.debug('Disconnected. Thanks for playing.');
					enableStart();
					gameEnded = true;
				});
		};

		recover = function() {
			if (_socket) {
				_socket.disconnect();
			}
			enableStart();
		};

		return {
			onerror: function(message, url, linenumber) {
				Blabber.error(url + linenumber + ': ' + message);
				recover();
				return false;
			},
			start: function(username, code, oauth) {
				if (inSession) {
					return;
				}
				$('#consolelog').html('');
				GameBoard.cleanup();
				inSession = true;
				_oauth = oauth;
				connect(username, function(socket) {
					var commander = new Commander(socket);
					var brain = new Brain(commander);
					var gameBoard = new GameBoard();
					if (!brain.setStrategy(code)) {
						socket.disconnect();
						return;
					}
					setupGame(socket, brain, commander, gameBoard);
				});
			}
		};
	}
);
