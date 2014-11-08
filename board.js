function Board() {
	this.x = null;
	this.y = null;

	this.init = function (x, y) {
		this.x = x;
		this.y = y;
	};

	this.get_free_place = function (length, min_distance_to_others) {
		var r = 10 + Math.round(Math.random() * 30);

		return {
			from: {
				x: 5,
				y: r
			}, to: {
				x: 10,
				y: r
			}
		};
	};

	this.check_free = function (x, y, snakes_list) {
		snakes_list.forEach(function (s) {
			s.snake.forEach(function (s2) {
				if (s2.x === x && s2.y === y) {
					return false;
				}
			});
		});

		return true;
	};
}
;

module.exports = {Board: Board};
