var Brain = (function() {
	var strategy;

	function Brain(commander) {
		this.commander = commander;
	}

	Brain.prototype.setStrategy = function(code) {
		// Pad with json
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
		strategy(roundInfo, this.commander);
		this.commander.sendToServer();
	};

	return Brain;

}());
