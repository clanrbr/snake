var app = require('express')(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	port = 3000,
	Room = require('./room.js'),
	rooms_list = new Array(),
	rooms_actions = {'Noobs': [], 'Mellee': [], 'Deathmatch': []},
fps = 3,
	sockets = {},
	send_data = function () {
	};

server.listen(port);
console.log('Listening on port ' + port);

// For testing purposes
var newRoom1 = new Room.Room({name: 'Noobs', total_players: 5, gridx: 50, gridy: 50});
rooms_list.push(newRoom1);
var newRoom2 = new Room.Room({name: 'Mellee', total_players: 5, gridx: 60, gridy: 30});
rooms_list.push(newRoom2);
var newRoom3 = new Room.Room({name: 'Deathmatch', total_players: 5, gridx: 60, gridy: 40});
rooms_list.push(newRoom3);

// GET static content
app.get('/*', function (req, res) {
	var requested_file = req.url;

	if (requested_file === '/') {
		requested_file += 'index.html';
	}

	console.log('Served static content ' + requested_file);
	res.sendFile(__dirname + '/webroot' + requested_file);
});

// Start app code
io.on('connection', function (socket) {
	sockets[socket.id] = socket;

	// join a room
	socket.on('joinRoom', function (data) {
		// check for existing room
		var room_name = data.room,
			room = rooms_list.filter(function (room) {
				return room.getRoomName() === room_name;
			})[0];

		if (room) {
			if (room.already_joined(socket.id)) {
				socket.emit('message', 'You already play in ' + room_name);
			} else if (room.isFull()) {
				socket.emit('message', room_name + ' is full');
			} else {
				socket.join(room_name);
				room.setOneMorePlayer(socket.id);
				socket.emit('coordinates', room.snakes_list.map(function (s) {
					return {
						snake: s.snake,
						current_direction: s.current_direction
					};
				}));
				socket.emit('message', 'You are in room ' + room_name);
				socket.room = room_name;
				emit_rooms_statistics(room_name);
			}
		} else {
			socket.emit('message', 'Room with that name does not exist: ' + room_name);
		}
	});

	socket.on('leaveRoom', function (data) {
		// check for existing room
		var room_name = data.room,
			room = rooms_list.filter(function (room) {
				return room.getRoomName() === room_name;
			})[0];

		if (room) {
			if (room.already_joined(socket.id)) {
				socket.leave(room_name);
				room.removeOnePlayer(socket.id);
				delete socket.room;
				socket.emit('message', 'You just left room ' + room_name);
				emit_rooms_statistics(room_name);
			} else {
				socket.emit('message', 'You are not in room ' + room_name);
			}
		} else {
			socket.emit('message', 'Room with that name does not exists: ' + room_name);
		}
	});

	socket.on('rooms_statistics', function () {
		emit_rooms_statistics();
	});

	socket.on('move', function (direction) {
		rooms_actions[socket.room].forEach(function (s, index) {
			if (s.socket_id === socket.id) {
				rooms_actions[socket.room].splice(index, 1);
			}
		});

		rooms_actions[socket.room].push({
			socket_id: socket.id,
			direction: direction
		});
	});

	function emit_rooms_statistics(room) {
		if (room) {
			socket.to(room).emit('rooms_statistics', rooms_list.map(function (room) {
				return room.get_statistics();
			}));
		} else {
			socket.emit('rooms_statistics', rooms_list.map(function (room) {
				return room.get_statistics();
			}));
		}
	}

	socket.on('disconnect', function (socket) {
		delete sockets[socket.id];
	});
});

var emit_positions = function (room) {
	room.players_list.forEach(function (socket_id, index) {
		sockets[socket_id].emit('data', {
		});
	});
};

setInterval(function () {
	rooms_list.forEach(function (r) {
		emit_positions(r);
	});
}, 1000 / fps);
