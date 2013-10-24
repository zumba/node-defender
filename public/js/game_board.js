var GameBoard = (function() {
	var _round;
	var _previousRound;

	var _boardId = 'gameboard';
	var _boardStage;
	var _boardLayer;
	var _boardCenter;

	var _positions = [];
	var _enemies = [];

	var BOARD_SIZE = { w: 650, h: 550 },
		ENEMY_ICON_SIZE = 30,
		PROFILE_GRAVATAR_SIZE = 30,
		POSITION_OFFSET = Math.sqrt(2 * Math.pow(PROFILE_GRAVATAR_SIZE, 2)) / 2,
		POSITION_WIDTH = Math.sqrt(2 * Math.pow(ENEMY_ICON_SIZE, 2)) + 2,
		ENEMY_ICONS = {
			grunt: 'http://www.southeastarrow.com/images/icons/blue-left-arrow.png',
			swarmer: 'http://www.southeastarrow.com/images/icons/blue-left-arrow.png',
			trooper: 'http://www.southeastarrow.com/images/icons/blue-left-arrow.png',
			'speed-demon': 'http://www.southeastarrow.com/images/icons/blue-left-arrow.png',
			flyer: 'http://www.southeastarrow.com/images/icons/blue-left-arrow.png',
			cluster: 'http://www.southeastarrow.com/images/icons/blue-left-arrow.png',
			bruiser: 'http://www.southeastarrow.com/images/icons/blue-left-arrow.png'
		};

	function Position(num, center) {
		this.num = num;
		this.center = center;
		this.spots = [];

		this.radius = POSITION_OFFSET + this.num * POSITION_WIDTH;
		this.maxOfSpots = Math.floor((2 * Math.PI * (this.radius + POSITION_WIDTH / 2)) / (ENEMY_ICON_SIZE * 1.5));

		this.renderMark();
	};

	Position.prototype.getMaxSpots = function() {
		return this.maxOfSpots;
	};

	Position.prototype.getFreeSpot = function() {
		for (var i = 0; i < this.getMaxSpots(); i++) {
			if (typeof this.spots[i] === 'undefined' || this.spots[i] === false) {
				return this.spots[i] = i;
			}
		}
		return -1;
	};

	Position.prototype.renderMark = function() {
		this.mark = new Kinetic.Circle({
			x: this.center.x,
			y: this.center.y,
			radius: this.radius,
			stroke: '#555',
			strokeWidth: 1,
			dashArray: [10, 10]
		});
		_boardLayer.add(this.mark);
	};

	Position.prototype.getRadius = function() {
		return this.radius;
	};

	Position.prototype.setSpot = function(spot, enemy) {
		if (spot >= this.maxOfSpots) {
			return;
		}
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

			// Calculate the position on board
			var spotAngle = 360 / pos.getMaxSpots();
			var spotRad = spotAngle * Math.PI / 180;
			var enemyRad = spotRad * posSpot;

			var marginSpace = (POSITION_WIDTH - ENEMY_ICON_SIZE) / 2;
			var posX = (pos.getRadius() + marginSpace) * Math.cos(enemyRad);
			var posY = (pos.getRadius() + marginSpace) * Math.sin(enemyRad);

			var imageObj = new Image();
			imageObj.onload = function() {
				_enemies[mob.id] = new Kinetic.Image({
					x: _boardCenter.x + posX,
					y: _boardCenter.y + posY,
					image: imageObj,
					rotation: enemyRad,
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
			var gravatar = new Kinetic.Image({
				x: _boardCenter.x - (PROFILE_GRAVATAR_SIZE / 2),
				y: _boardCenter.y - (PROFILE_GRAVATAR_SIZE / 2),
				image: imageObj,
				width: PROFILE_GRAVATAR_SIZE,
				height: PROFILE_GRAVATAR_SIZE
			});
			_boardLayer.add(gravatar);
			_boardStage.add(_boardLayer);
		};
		imageObj.src = 'https://pbs.twimg.com/profile_images/2614463797/6tubelo97kiphf2jmehx_normal.jpeg';
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
			width: BOARD_SIZE.w,
			height: BOARD_SIZE.h
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