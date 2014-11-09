var Board = function () {
	this.x = null;
	this.y = null;

	this.init = function (x, y) {
		this.x = x;
		this.y = y;
	};

	this.get_free_place = function (length, min_distance_to_others, snakes_list) {
		var matrix = []; // [x(0-n): {y: (0-n), hot_head:(0-), hot_tail:(0-)}]

		for (var x = 0; x < this.x; x++) {
			matrix[x] = [];

			for (var y = 0; y < this.y; y++) {
				matrix[x][y] = {
					hot_head: Math.round(Math.max((this.x - 1 - Math.min(x, this.x - 1 - x)) / (this.x - 1), (this.y - 1 - Math.min(y, this.y - 1 - y)) / (this.y - 1)) * 1000),
					hot_tail: 0
				};
			}
		}

		for (var socket_id in snakes_list) {
			var snake = snakes_list[socket_id].snake;

			for (var i in snake) {
				for (var x = Math.max(0, snake[i].x - min_distance_to_others); x < Math.min(this.x, snake[i].x + min_distance_to_others); x++) {
					for (var y = Math.max(0, snake[i].y - min_distance_to_others); y < Math.min(this.y, snake[i].y + min_distance_to_others); y++) {
						var d = Math.abs(x - snake[i].x) + Math.abs(y - snake[i].y);

						if (d > min_distance_to_others) {
							continue;
						}

						matrix[x][y].hot_head += ((min_distance_to_others + 1 - d) / min_distance_to_others) * 1000;
						matrix[x][y].hot_tail += ((min_distance_to_others + 1 - d) / min_distance_to_others) * 1000;
					}
				}
			}
		}

		// find coldest heads
		var min = Number.MAX_VALUE,
			heads = [];

		for (var x = 0; x < this.x; x++) {
			for (var y = 0; y < this.y; y++) {
				if (matrix[x][y].hot_head < min) {
					min = matrix[x][y].hot_head;
					heads = [];
					heads.push({x: x, y: y});
				} else if (matrix[x][y].hot_head === min) {
					heads.push({x: x, y: y});
				}
			}
		}

		var head = heads[0],
			r = matrix[head.x + (length - 1)][head.y] || {hot_tail: -1},
			l = matrix[head.x - (length - 1)][head.y] || {hot_tail: -1},
			u = matrix[head.x][head.y - (length - 1)] || {hot_tail: -1},
			d = matrix[head.x][head.y + (length - 1)] || {hot_tail: -1},
			tail_min = Number.MAX_VALUE,
			a = {l: l, r: r, u: u, d: d},
		w = 'r';

		for (var i in a) {
			if(a[i].hot_tail === -1){
				continue;
			}

			if (a[i].hot_tail < tail_min) {
				w = i;
			}

			tail_min = Math.min(tail_min, a[i].hot_tail);
		}

		var tail;
		switch(w){
			case 'r':
				tail = {x: 1, y: 0};
				break;
			case 'l':
				tail = {x: -1, y: 0};
				break;
			case 'u':
				tail = {x: 0, y: -1};
				break;
			case 'd':
				tail = {x: 0, y: 1};
				break;
		}

		return {
			from: {
				x: head.x,
				y: head.y
			}, to: {
				x: head.x + tail.x * (length - 1),
				y: head.y + tail.y * (length - 1)
			}
		};
	};

	this.check_free = function (x, y, snakes_list) {
		if (x < 0 || x >= this.x || y < 0 || y >= this.y) {
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
