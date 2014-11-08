var io_address = 'http://localhost:3000',
	socket = io.connect(io_address),
	Snakes = {},
	snakes_here = false;

window.onload = function () {
	socket.emit('rooms_statistics');

	socket.on('data', function (data) {
		if (!snakes_here) {
			for (var i in data) {
				Snakes[i] = new Snake();
				Snakes[i].init();
			}

			snakes_here = true;
		}

		for (var i in data) {
			Snakes[i].move(data);
		}
	});

	socket.on('message', function (data) {
		console.log(data);
	});

	socket.on('rooms_statistics', function (rooms) {
		console.log('rooms_statistics', rooms);
	});

	socket.on('coordinates', function (coordinates) {
		console.log('coordinates', coordinates);
		Snakes.generate_snake(coordinates.from, coordinates.to);
	});
};

function joinRoom(roomnumb) {
//	socket.emit('joinRoom', { room: Math.floor(Math.random()*100) });
	if (roomnumb === 1) {
		socket.emit('joinRoom', {room: 'Noobs'});
	} else if (roomnumb === 2) {
		socket.emit('joinRoom', {room: 'Mellee'});
	}
	else if (roomnumb === 3) {
		socket.emit('joinRoom', {room: 'Deathmatch'});
	}
}

function leaveRoom() {
	socket.emit('leaveRoom', {room: 'Noobs'});
}
