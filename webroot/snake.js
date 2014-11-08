var Snake = {
	box: null,
	box_side: 20,
	snake: [],
	current_direction: null,
	init: function () {
		this.box = document.getElementById('snakediv');
	},
	generate_pixel: function (x, y, tail) {
		this.box.innerHTML = this.box.innerHTML + '<div class="snake_element" style="width: 20px; height: 20px; background-color: red; position: absolute; margin-top: ' + y + 'px; margin-left: ' + x + 'px;">&nbsp;</div>';

		if (tail) {
			this.snake.push({x: x, y: y});
		} else {
			this.snake.unshift({x: x, y: y});
		}
	},
	remove_pixel: function () {
		this.box.removeChild(this.box.getElementsByClassName('snake_element')[0]);
		this.snake.pop();
	},
	generate_snake: function (from, to) {
		for (var x = from.x; x < to.x; x += this.box_side) {
			for (var y = from.y; y < to.y; y += this.box_side) {
				this.generate_pixel(x, y, false);
			}
		}

		this.set_current_direction();
	},
	move: function (direction) {
		if (direction === this.get_opposite_direction()) {
			return;
		}

		console.log('before', this.current_direction);

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

		this.set_current_direction();
		console.log('after', this.current_direction);
	},
	move_head: function (x, y) {
		var current_head = this.snake[0],
			new_head = {
				x: current_head.x + x * this.box_side,
				y: current_head.y + y * this.box_side
			};

		this.generate_pixel(new_head.x, new_head.y, false);
	},
	move_tail: function () {
		this.remove_pixel();
	},
	set_current_direction: function () {
		var snake_element0 = this.snake[0],
			snake_element1 = this.snake[1];

		if (snake_element0.x > snake_element1.x) {
			this.current_direction = 'right';
		} else if (snake_element0.x < snake_element1.x) {
			this.current_direction = 'left';
		} else if (snake_element0.y < snake_element1.y) {
			this.current_direction = 'up';
		} else if (snake_element0.y > snake_element1.y) {
			this.current_direction = 'down';
		} else {
			alert('WTF man?!');
		}

		console.log(this.current_direction);
	},
	get_opposite_direction: function () {
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
	}
};
