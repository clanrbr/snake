function Snake() {
	this.id = null;
	this.box = null;
	this.box_side = 20;
	this.snake = [];
	this.current_direction = null;
	this.grow = 0;
	this.last_direction = null;
	this.color=null;
	this.init = function () {
		this.box = document.getElementById('snakediv');
	};
	this.generate_pixel = function (x, y, tail) {
		var directionstyle="sss_left_right_"+this.color;

		if (this.current_direction==='up' || this.current_direction==='down') {
			directionstyle="sss_top_down_"+this.color;
		}

		// directionstyle='sss_head_yellow';
		this.box.innerHTML = this.box.innerHTML + '<div class="' + directionstyle + ' ' + this.id + '" style="top: ' + y * this.box_side + 'px; left: ' + x * this.box_side +
			'px;">&nbsp;</div>';

		if (tail) {
			this.snake.push({x: x, y: y});
		} else {
			this.snake.unshift({x: x, y: y});
		}
	};
	this.rotateSnake = function (element,head) {
		var directionstyle="sss_left_right_"+this.color;
		if (this.current_direction==='up' || this.current_direction==='down') {
			directionstyle="sss_top_down_"+this.color;
		}

		if (head) {
			if (element > 0) {
				document.getElementsByClassName(this.id)[element - 1].className = directionstyle + ' ' + this.id;
			} else {
				document.getElementsByClassName(this.id)[1].className = directionstyle + ' ' + this.id;
			}
			directionstyle='sss_head_'+this.color;
		}

		if (element>0) {
			document.getElementsByClassName(this.id)[0].className = 'sss_tail ' + this.id;
		} else {
			document.getElementsByClassName(this.id)[this.snake.length-1].className = 'sss_tail ' + this.id;
		}

		document.getElementsByClassName(this.id)[element].className = directionstyle + ' ' + this.id;
	};
	this.remove_pixel = function () {
		this.box.removeChild(this.box.getElementsByClassName(this.id)[0]);
		this.snake.pop();
	};
	this.generate_snake = function (from, to) {
		for (var x = from.x; x <= to.x; x++) {
			for (var y = from.y; y <= to.y; y++) {
				this.generate_pixel(x, y, false);
			}
		}

		this.set_current_direction();
		this.rotateSnake(0);
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

		this.set_current_direction();
		this.rotateSnake(this.snake.length-1,1);

	};
	this.move_head = function (x, y) {
		var current_head = this.snake[0],
			new_head = {
				x: current_head.x + x,
				y: current_head.y + y
			};

		this.generate_pixel(new_head.x, new_head.y, false);
	};
	this.move_tail = function () {
		if (this.grow) {
			this.grow--;
		} else {
			this.remove_pixel();
		}
	};
	this.set_current_direction = function () {
		this.last_direction = this.current_direction;
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
		}
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
}
;
