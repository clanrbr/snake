function Board() {
	this.x = null;
	this.y = null;

	this.init = function (x, y) {
		this.x = x;
		this.y = y;
	};

	this.get_free_place = function (length, min_distance_to_others) {
		var r = 10 + Math.round(Math.random() * 10);

		return {
			from: {
				x: 5,
				y: r
			}, to: {
				x: 25,
				y: r
			}
		};
	};

	this.check_free = function (x, y, snakes_list) {
		if (x < 0 || x > this.x || y < 0 || y > this.y) {
			return false;
		}

		for (var socket_id in snakes_list) {
			var s = snakes_list[socket_id];

			for (var i in s.snake) {
				var s2 = s.snake[i];

				if (s2.x === x && s2.y === y) {
					return false;
				}
			}
		}

		return true;
	};
}

module.exports = {Board: Board};
