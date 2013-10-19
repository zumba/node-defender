var Blabber = (function() {

	var consoleDisplay = $('#consolelog');

	var damageTemplates = {
		weak: [
			'%s barely scratches %s.',
			'%s mostly wiffed %s.',
			'%s broke the skin of %s.'
		],
		normal: [
			'%s damages %s.',
			'%s hits %s.',
			'%s strikes %s.'
		],
		strong: [
			'%s pulverizes %s',
			'%s knocked %s back to last thursday.',
			'%s put a boot up %s\'s butt.'
		]
	};

	var getWeightedDamageSentence = function(attack) {
		var strength = attack.damage >= 10 ? 'strong' :
			attack.damage > 5 && attack.damage < 10 ? 'normal' :
			'weak';
		return getRandomDamageSentence(strength);
	};

	var getRandomDamageSentence = function(type) {
		return damageTemplates[type][Math.floor(Math.random() * damageTemplates[type].length)];
	};

	var htmlWrap = function(message, color) {
		color = color || 'white';
		if (typeof message !== 'string') {
			message = JSON.stringify(message);
		}
		return '<p style="color: ' + color + '">' + message + '</p>';
	}

	var echo = function(message) {
		consoleDisplay.scrollTop(consoleDisplay.prop('scrollHeight'));
		consoleDisplay.append(message);
	}

	function Blabber(roundInfo) {
		this.round = roundInfo;
	}

	Blabber.prototype.displayPlayerActions = function() {
		_.each(this.round.getMyAttacks(), function(attack) {
			var msg = getWeightedDamageSentence(attack) + ' (%s damage)';
			Blabber.debug(sprintf(msg, this.round.playerName(), this.round.getEnemyTypeById(attack.enemyId) + '(' + attack.enemyId + ')', attack.damage));
		}, this);
	};

	Blabber.prototype.displayEnemyActions = function() {
		_.each(this.round.getEnemyActions(), function(action) {
			var msg, enemyType;

			enemyType = this.round.getEnemyTypeById(action.id) + ' (' + action.id + ')';
			switch(action.type){
				case 'attack':
					msg = getWeightedDamageSentence(action) + ' (%s damage)';
					Blabber.warn(sprintf(msg, enemyType, this.round.playerName(), action.damage));
					break;
				case 'move':
					Blabber.warn(sprintf('%s moved to position %s', enemyType, action.position));
			}
		}, this);
	};

	Blabber.prototype.displayPlayerHealth = function() {
		var displayMode,
			playerHealth = this.round.playerHealth();
		if (playerHealth >= 700) {
			displayMode = 'info';
		} else if (playerHealth > 300 && playerHealth < 700) {
			displayMode = 'warn';
		} else {
			displayMode = 'error';
		}
		if (typeof Blabber[displayMode] === 'function') {
			Blabber[displayMode](sprintf('Player health: %s', playerHealth));
		}
	};

	Blabber.prototype.debugOutput = function() {
		Blabber.debug(this.round.debug());
	};

	// Static API
	Blabber = _.extend(Blabber, {
		debug: function(message) {
			echo(htmlWrap(message, 'green'));
		},
		info: function(message) {
			echo(htmlWrap(message, 'cyan'));
		},
		warn: function(message) {
			echo(htmlWrap(message, 'yellow'));
		},
		error: function(message) {
			echo(htmlWrap(message, 'red'));
		},
	});

	return Blabber;

}());
