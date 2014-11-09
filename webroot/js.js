var io_address = 'http://localhost:3000',
	socket = io.connect(io_address),
	Snakes = {},
	statistics = [],
	current_room = '',
	killed = null,
	glob_snake_name = null;

window.onload = function () {
	socket.emit('rooms_statistics');

	socket.on('data', function (data) {
		var timestamp = +new Date();

		for (var i in data) {
			if (Snakes[data[i].socket_id]) {
				Snakes[data[i].socket_id].move(data[i].direction);
				Snakes[data[i].socket_id].timestamp = timestamp;
			}
		}

		for (var i in Snakes) {
			if (Snakes[i].timestamp !== timestamp) {
				Snakes[i].move(Snakes[i].current_direction);
				Snakes[i].timestamp = timestamp;
			}
		}
	});

	socket.on('message', function (data) {
		if (data) {
			document.getElementById('room_error').innerHTML = data;
		}
	});

	socket.on('join_status', function (data) {
		console.log('join_status', data);
		if (data != 1) {
			document.getElementById('show_error').style.display = "block";
			switchScreen(1);
		}

	});

	socket.on('leave_status', function (data) {
		console.log(data);
	});


	socket.on('rooms_statistics', function (rooms) {
		room1 = document.getElementById('room1').innerHTML = rooms[0].name;
		document.getElementById('roomname1').innerHTML = rooms[0].name;
		document.getElementById('roomdescription1').innerHTML = rooms[0].description;
		document.getElementById('current_players1').innerHTML = rooms[0].current_players;
		document.getElementById('max_players1').innerHTML = rooms[0].max_players;

		room2 = document.getElementById('room2').innerHTML = rooms[1].name;
		document.getElementById('roomname2').innerHTML = rooms[1].name;
		document.getElementById('roomdescription2').innerHTML = rooms[1].description;
		document.getElementById('current_players2').innerHTML = rooms[1].current_players;
		document.getElementById('max_players2').innerHTML = rooms[1].max_players;

		room3 = document.getElementById('room3').innerHTML = rooms[2].name;
		document.getElementById('roomname3').innerHTML = rooms[2].name;
		document.getElementById('roomdescription3').innerHTML = rooms[2].description;
		document.getElementById('current_players3').innerHTML = rooms[2].current_players;
		document.getElementById('max_players3').innerHTML = rooms[2].max_players;


		statistics = rooms;
	});

	socket.on('coordinates', function (data) {
		console.log('coordinates', data);
		var colors = ['yellow', 'red', 'blue', 'green', 'yellow'];

		var current_player = 0;
		for (var i in data) {
			if (Snakes[data[i].socket_id]) {
				current_player++;
				continue;
			}
			Snakes[data[i].socket_id] = new Snake();
			Snakes[data[i].socket_id].init();
			Snakes[data[i].socket_id].id = data[i].socket_id;
			Snakes[data[i].socket_id].color = colors[current_player % colors.length];
			Snakes[data[i].socket_id].generate_whole_snake(data[i].snake);
			current_player++;
		}
	});

	socket.on('grow', function (data) {
		Snakes[data.snake].grow += data.value;
	});


	socket.on('death', function (socket_id) {
		console.log('death', socket_id, socket);
		if (socket.io.engine.id === socket_id) {
			killed = 1;
			document.getElementById('snakediv').style.display = "none";
			document.getElementById('death_screen').style.display = "block";
			document.getElementById('stats').style.display = "block";
		}

		if (Snakes[socket_id].snake.length > 0) {
			document.getElementById('stats').innerHTML = 'Your snake: <strong>' + glob_snake_name + '</strong> scrored ' + (Snakes[socket_id].snake.length - 4) + ' points.';
			for (var i in Snakes[socket_id].snake) {
				while (document.getElementsByClassName(socket_id).length) {
					document.getElementsByClassName(socket_id)[0].parentNode.removeChild(document.getElementsByClassName(socket_id)[0]);
				}
			}
			delete Snakes[socket_id];
		}
	});

	socket.on('food', function (foods) {
		while (document.getElementsByClassName('food').length) {
			document.getElementsByClassName('food')[0].remove();
		}

		for (var i in foods) {
			document.getElementById('snakediv').innerHTML = document.getElementById('snakediv').innerHTML + '<div class="food food' + foods[i].value + '" style="top: ' + foods[i].y * 20 + 'px; left: ' + foods[i].x * 20 + 'px;" data-value="' + foods[i].value + '">&nbsp;</div>';
		}
	});
};

function startGame() {
	if (current_room) {
		switchScreen(2);
		glob_snake_name = document.getElementById('snake_name').value;
		// setTimeout(function () {
		socket.emit('joinRoom', {room: current_room});

		// }, 2000);

		window.addEventListener("keydown", function (e) {
			if (killed === 1)
				return true;
			var prevent_default = e.keyCode >= 37 && e.keyCode <= 40;

			switch (e.keyCode) {
				case 37:
				case 65:
				case 100:
					socket.emit('move', 'left');
					break;
				case 38:
				case 87:
				case 104:
					socket.emit('move', 'up');
					break;
				case 39:
				case 68:
				case 102:
					socket.emit('move', 'right');
					break;
				case 40:
				case 83:
				case 98:
					socket.emit('move', 'down');
					break;
			}

			if (prevent_default) {
				e.preventDefault();
			}

			return !prevent_default;
		});
	}
}

function leaveGame() {
	if (current_room) {
		window.location.href = window.location.href;
	}
}

function joinRoom(roomname) {
	if (roomname) {
		room = statistics.filter(function (room) {
			return room.name === roomname;
		})[0];

		if (room) {
			current_room = roomname;
			switchScreen(1);
			snakediv = document.getElementById('snakediv');
			snakediv.style.display = "block";
			snakediv.style.width = room.gridx * 20 + 'px';
			snakediv.style.height = room.gridy * 20 + 'px';

			var background = 'background_800_500 board_screen';
			if ((room.gridx * 20) === 1000) {
				background = 'background_1000_800 board_screen';
			} else if ((room.gridx * 20) === 1600) {
				background = 'background_1600_800 board_screen';
			}

			snakediv.className = background;
		}
	}
}

function switchScreen(show_screen) {
	input_screen = document.getElementById('input_screen');
	leave_screen = document.getElementById('leave_screen');
	// board_screen = document.getElementById('board_screen');

	input_screen.style.display = "none";
	leave_screen.style.display = "none";
	// board_screen.style.display = "none";

	if (show_screen === 1) {
		input_screen.style.display = "block";
	} else if (show_screen === 2) {
		begin_screen.style.visibility = "hidden";
		// begin_screen.style.display = "none";
		leave_screen.style.display = "block";
	}
}

function leaveRoom() {
	socket.emit('leaveRoom', {room: 'Noobs'});
}
