var GameBoard = (function() {
	var _round;
	var _previousRound;

	var _boardId = 'gameboard';
	var _boardStage;
	var _boardLayer;
	var _boardCenter;

	var _positions = [];
	var _enemies = [];

	var POSITION_OFFSET = 70,
		POSITION_WIDTH = 50,
		ENEMY_ICON_SIZE = 30,
		ENEMY_ICONS = {
			grunt: 'http://images3.wikia.nocookie.net/__cb20130111055640/reignofdragons/images/2/28/Symbol.Melee.30.png',
			swarmer: 'http://images3.wikia.nocookie.net/__cb20130111055640/reignofdragons/images/2/28/Symbol.Melee.30.png',
			trooper: 'http://images3.wikia.nocookie.net/__cb20130111055640/reignofdragons/images/2/28/Symbol.Melee.30.png',
			'speed-demon': 'http://images3.wikia.nocookie.net/__cb20130111055640/reignofdragons/images/2/28/Symbol.Melee.30.png',
			flyer: 'http://images3.wikia.nocookie.net/__cb20130111055640/reignofdragons/images/2/28/Symbol.Melee.30.png',
			cluster: 'http://images3.wikia.nocookie.net/__cb20130111055640/reignofdragons/images/2/28/Symbol.Melee.30.png',
			bruiser: 'http://images3.wikia.nocookie.net/__cb20130111055640/reignofdragons/images/2/28/Symbol.Melee.30.png'
		};

	function Position(num, center) {
		this.num = num;
		this.center = center;
		this.spots = [];
		this.renderMark();
	};

	Position.prototype.getFreeSpot = function() {
		for (var i = 0; i < 100; i++) {
			if (typeof this.spots[i] === 'undefined' || this.spots[i] === false) {
				return i;
			}
		}
		return -1;
	};

	Position.prototype.renderMark = function() {
		this.mark = new Kinetic.Circle({
			x: this.center.x,
			y: this.center.y,
			radius: this.num * POSITION_WIDTH + POSITION_OFFSET,
			stroke: '#555',
			strokeWidth: 2
		});
		_boardLayer.add(this.mark);
	};

	Position.prototype.getRadius = function() {
		return this.mark.getRadius();
	};

	Position.prototype.setSpot = function(spot, enemy) {
		this.spots[spot] = enemy;
	};

	var renderMobs = function(mobs) {
		_.each(mobs, function(mob) {
			if (typeof _enemies[mob.id] !== 'undefined') {
				// Do not render if the enemy is on the board
				return;
			}

			var pos = _positions[mob.position];
			var posSpot = pos.getFreeSpot();
			if (posSpot < 0) {
				// No spot available
				return;
			}

			var mpi = Math.PI / 180;
			var incrementAngle = 360 / 10;
			var incrementRadians = incrementAngle * mpi;
			var startRadians = incrementRadians * posSpot;
			var posX = Math.cos(startRadians) * pos.getRadius() + (POSITION_WIDTH - ENEMY_ICON_SIZE) / 2;
			var posY = Math.sin(startRadians) * pos.getRadius();

			var imageObj = new Image();
			imageObj.onload = function() {
				_enemies[mob.id] = new Kinetic.Image({
					x: _boardCenter.x + posX,
					y: _boardCenter.y + posY,
					image: imageObj,
					width: ENEMY_ICON_SIZE,
					height: ENEMY_ICON_SIZE
				});
				pos.setSpot(posSpot, _enemies[mob.id]);
				_enemies[mob.id].boardPosition = posSpot;
				_boardLayer.add(_enemies[mob.id]);
				_boardStage.add(_boardLayer);
			};
			imageObj.src = ENEMY_ICONS[mob.type];
		});
	};

	function GameBoard(roundInfo) {
		_previousRound = _round;
		_round = roundInfo;
		renderMobs(_round.getMobs());
	}

	GameBoard.prototype.displayAttack = function() {
		// @todo animate the attack

		_.each(_round.getMyAttacks(), function(attack) {
			var enemy = attack.enemyId,
				isEnemyDead = !_.find(_round.getMobs(), function(mob) { return mob.id === enemy; });

			if (isEnemyDead) {
				_positions[attack.position].setSpot(_enemies[enemy].boardPosition, false);
				_enemies[enemy].remove();
				delete _enemies[enemy];
			}
		});
	};

	GameBoard.prototype.displayEnemyAttack = function() {
	};

	GameBoard.renderUser = function() {
		var imageObj = new Image();
		imageObj.onload = function() {
			var imgDimension = 73;
			var gravatar = new Kinetic.Image({
				x: _boardCenter.x - (imgDimension / 2),
				y: _boardCenter.y - (imgDimension / 2),
				image: imageObj,
				width: imgDimension,
				height: imgDimension
			});
			_boardLayer.add(gravatar);
			_boardStage.add(_boardLayer);
		};
		imageObj.src = 'https://pbs.twimg.com/profile_images/2614463797/6tubelo97kiphf2jmehx_bigger.jpeg';
	};

	GameBoard.renderPositionMarks = function() {
		_.each([0, 1, 2, 3, 4, 5], function(pos) {
			_positions[pos] = new Position(pos, _boardCenter);
		});
	};

	GameBoard.renderTemplate = function() {
		GameBoard.renderUser();
		GameBoard.renderPositionMarks();
	};

	GameBoard.boardSetup = function() {
		_boardStage = new Kinetic.Stage({
			container: _boardId,
			width: 800,
			height: 500
		});
		_boardCenter = {
			x: _boardStage.getWidth() / 2,
			y: _boardStage.getHeight() / 2
		};
		_boardLayer = new Kinetic.Layer();

		GameBoard.renderTemplate();
	};

	return GameBoard;

}());