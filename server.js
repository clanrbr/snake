var app = require('express')(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	port = 3000,
	Room = require('./room.js'),
	rooms_list = new Array(),
	fps = 3;

server.listen(port);
console.log('Listening on port ' + port);

// For testing purposes
var newRoom1 = new Room.Room({name: 'Noobs', total_players: 5, gridx: 1000, gridy: 1000});
rooms_list.push(newRoom1);
var newRoom2 = new Room.Room({name: 'Mellee', total_players: 5, gridx: 1200, gridy: 600});
rooms_list.push(newRoom2);
var newRoom3 = new Room.Room({name: 'Deathmatch', total_players: 5, gridx: 1200, gridy: 800});
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

	// generate random side
	var sizes = ['left', 'right', 'up', 'down'];

	// shout for that side
	setInterval(function () {
		if (socket.joined) {
			socket.emit('sizes', {size: sizes[Math.floor(Math.random() * 4)]});
		}
	}, 1000 / fps);

	// join a room
	socket.on('joinRoom', function (data) {
		console.log('before', rooms_list);
		// check for existing room
		var room_name = data.room,
			room = rooms_list.filter(function (room) {
				return room.getRoomName() === room_name;
			})[0];

		if (room) {
			if (room.already_joined(socket.id)) {
				socket.emit('joinRoom', 'You already play in ' + room_name);
			} else if (room.isFull()) {
				socket.emit('joinRoom', room_name + ' is full');
			} else {
				socket.join(room_name);
				var coordinates = room.setOneMorePlayer(socket.id);
				console.log('coords', coordinates);
				socket.emit('coordinates', coordinates);
				socket.emit('joinRoom', 'You are in room ' + room_name);
				socket.joined = true;
				emit_rooms_statistics(room_name);
			}
		} else {
			socket.emit('joinRoom', 'Room with that name does not exist: ' + room_name);
		}

		console.log('after', rooms_list);
	});


	socket.on('leaveRoom', function (data) {
		console.log('before', rooms_list);
		// check for existing room
		var room_name = data.room,
			room = rooms_list.filter(function (room) {
				return room.getRoomName() === room_name;
			})[0];

		if (room) {
			if (room.already_joined(socket.id)) {
				socket.leave(room_name);
				room.removeOnePlayer(socket.id);
				delete socket.joined;
				socket.emit('leaveRoom', 'You just left room ' + room_name);
				emit_rooms_statistics(room_name);
			} else {
				socket.emit('leaveRoom', 'You are not in room ' + room_name);
			}
		} else {
			socket.emit('leaveRoom', 'Room with that name does not exists: ' + room_name);
		}

		console.log('after', rooms_list);
	});

	socket.on('rooms_statistics', function () {
		emit_rooms_statistics();
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

});
