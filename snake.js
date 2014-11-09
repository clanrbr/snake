var Snake = function () {
	this.snake = [];
	this.current_direction = null;
	this.next_direction = null;
	this.id = null;

	this.grow = function (x, y, tail) {
		if (tail) {
			this.snake.push({x: x, y: y});
		} else {
			this.snake.unshift({x: x, y: y});
		}
	};
	this.reduce = function () {
		this.snake.pop();
	};

	this.generate_snake = function (from, to) {
		for (var x = from.x; x <= to.x; x++) {
			for (var y = from.y; y <= to.y; y++) {
				this.grow(x, y);
			}
		}

		this.set_current_direction();
	};

	this.get_next_position = function (direction) {
		if (direction === this.get_opposite_direction()) {
			direction = this.current_direction;
		}

		var current_head = this.snake[0],
			x = direction === 'right' && 1 || direction === 'left' && -1 || 0,
			y = direction === 'up' && -1 || direction === 'down' && 1 || 0,
			new_head = {
				x: current_head.x + x,
				y: current_head.y + y
			};

		return new_head;
	};

	this.move = function (direction) {
		if (direction === this.get_opposite_direction()) {
			direction = this.current_direction;
		}

		switch (direction) {
			case 'up':
				this.move_head(0, -1);
				this.move_tail();
				break;
			case 'down':
				this.move_head(0, 1);
				this.move_tail();
				break;
			case 'right':
				this.move_head(1, 0);
				this.move_tail();
				break;
			case 'left':
				this.move_head(-1, 0);
				this.move_tail();
				break;
		}

		this.set_current_direction(direction);
	};

	this.move_head = function (x, y) {
		var current_head = this.snake[0],
			new_head = {
				x: current_head.x + x,
				y: current_head.y + y
			};

		this.grow(new_head.x, new_head.y);

		return new_head;
	};
	this.move_tail = function () {
		this.reduce();
	};

	this.set_current_direction = function (direction) {
		var snake_element0 = this.snake[0],
			snake_element1 = this.snake[1],
			current_direction = null;

		if (direction) {
			current_direction = direction;
		} else {
			if (snake_element0.x > snake_element1.x) {
				current_direction = 'right';
			} else if (snake_element0.x < snake_element1.x) {
				current_direction = 'left';
			} else if (snake_element0.y < snake_element1.y) {
				current_direction = 'up';
			} else if (snake_element0.y > snake_element1.y) {
				current_direction = 'down';
			}
		}

		this.current_direction = current_direction;
	};

	this.get_opposite_direction = function () {
		var opposite_direction = null;

		switch (this.current_direction) {
			case 'up':
				opposite_direction = 'down';
				break;
			case 'down':
				opposite_direction = 'up';
				break;
			case 'right':
				opposite_direction = 'left';
				break;
			case 'left':
				opposite_direction = 'right';
				break;
		}

		return opposite_direction;
	};
};

module.exports = {Snake: Snake};
