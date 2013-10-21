var Brain = (function() {
	var strategy;

	var _STORAGE_KEY = 'strategy';

	var _baseStrategyID = '#base-strategy';

	function Brain(commander) {
		this.commander = commander;
	}

	Brain.getBaseStrategy = function() {
		return $(_baseStrategyID).html();
	}

	Brain.retrieveStrategy = function() {
		var code;
		if (!window.sessionStorage) {
			return Brain.getBaseStrategy();
		}
		code = sessionStorage.getItem(_STORAGE_KEY);
		return code || Brain.getBaseStrategy();
	}

	Brain.storeStrategy = function(code) {
		if (!window.sessionStorage) {
			return;
		}
		sessionStorage.setItem(_STORAGE_KEY, code);
	}

	Brain.prototype.setStrategy = function(code) {
		// Pad with json
		Brain.storeStrategy(code);
		code = 'strategy = function(roundInfo, commander) {' + code + '};';
		try {
			eval(code);
		} catch (e) {
			console.log('Invalid JS!');
			return false;
		}
		return true;
	}

	Brain.prototype.onRound = function(roundInfo) {
		this.commander.target(_.first(roundInfo.getMobs()).id);
		strategy(roundInfo, this.commander);
		this.commander.sendToServer();
	};

	return Brain;

}());
