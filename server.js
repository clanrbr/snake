var app = require('express')(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	port = 3000,
	Rooms = require('./rooms.js'),
	rooms_list = new Array();

server.listen(port);
console.log('Listening on port ' + port);

// For testing purposes
var newRoom1 = new Rooms.Rooms({name: 'Noobs', total_players: 5, gridx: 1000, gridy: 1000, number_of_players: 0});
rooms_list.push(newRoom1);
var newRoom2 = new Rooms.Rooms({name: 'Mellee', total_players: 5, gridx: 1200, gridy: 600, number_of_players: 0});
rooms_list.push(newRoom2);
var newRoom3 = new Rooms.Rooms({name: 'Deathmatch', total_players: 5, gridx: 1200, gridy: 800, number_of_players: 0});
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
		socket.emit('sizes', {size: sizes[Math.floor(Math.random() * 4)]});
	}, 500);

	// socket.emit('subscribe', 1);

//	// create a room
//	socket.on('createRoom', function (data) {
//		var newRoom = new rooms.rooms({name: data.room, total_players: 5, gridx: 5, gridy: 5, number_of_players: 1});
//		rooms_list.push(newRoom);
//
//		socket.join(data.room);
//
//		socket.emit('createRoom', 'You are in room ' + data.room);
//
//		var i = 0;
//		var room_names = "";
//		while (i < rooms_list.length) {
//			room_names += rooms_list[i].getRoomName() + ",";
//			i++;
//		}
//		socket.emit('createRoom', 'List of all rooms ' + room_names);
//	});

	// join a room
	socket.on('joinRoom', function (data) {
		console.log('before', rooms_list);
		// check for existing room
		var room_name = data.room,
			room = rooms_list.filter(function (room) {
				return room.getRoomName() === room_name;
			})[0];

//		var i = 0;
//		var room_found = 0;
//		while (i < rooms_list.length) {
//			if (rooms_list[i].getRoomName() === data.room) {
//				room_found = 1;
//				break;
//			}
//			i++;
//		}
//
//		// if room exists
//		if (room_found === 1) {
//			// if room is full
//			if (rooms_list[i].isFull()) {
//				socket.emit('joinRoom', data.room + ' is full');
//			} else {
//				socket.join(data.room);
//				rooms_list[i].setOneMorePlayer();
//				socket.emit('joinRoom', 'You are in room ' + data.room);
//				socket.emit('rooms_statistics', rooms_list);
//			}
//		} else {
//			socket.emit('joinRoom', 'Room with that name does not exists: ' + data.room);
//		}

		if (room) {
			if (room.already_joined(socket.id)) {
				socket.emit('joinRoom', 'You already play in ' + room_name);
			} else if (room.isFull()) {
				socket.emit('joinRoom', room_name + ' is full');
			} else {
				socket.join(data.room);
				room.setOneMorePlayer(socket.id);
				socket.emit('joinRoom', 'You are in room ' + data.room);
				socket.emit('rooms_statistics', rooms_list);
			}
		} else {
			socket.emit('joinRoom', 'Room with that name does not exists: ' + room_name);
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

//		// check for existing room
//		var i = 0;
//		var room_found = 0;
//		while (i < rooms_list.length) {
//			if (rooms_list[i].getRoomName() === data.room) {
//				room_found = 1;
//				break;
//			}
//			i++;
//		}
//
//		if (room_found === 1) {
//			socket.leave(data.room);
//			rooms_list[i].removeOnePlayer(socket.id);
//			socket.emit('leaveroom', 'You just left room ' + data.room);
//			emit_rooms_statistics();
//		}

		if (room) {
			if (room.already_joined(socket.id)) {
				socket.leave(room_name);
				room.removeOnePlayer(socket.id);
				socket.emit('leaveRoom', 'You just left room ' + room_name);
				emit_rooms_statistics();
			} else {
				socket.emit('leaveRoom', 'You are not in room ' + room_name);
			}
		} else {
			socket.emit('leaveRoom', 'Room with that name does not exists: ' + room_name);
		}

		console.log('after', rooms_list);
	});

	socket.on('get_rooms', function () {
		emit_rooms_statistics();
	});

	function emit_rooms_statistics() {
		socket.emit('rooms_statistics', rooms_list.map(function (room) {
			return room.get_statistics();
		}));
	}

});
