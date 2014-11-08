var app = require('express')(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	port = 3000;
	rooms=require('./rooms.js');
	rooms_list= new Array();

server.listen(port);
console.log('Listening on port ' + port);

// GET /index.html
app.get('/*', function (req, res) {
	var requested_file = req.url;

	if (requested_file === '/') {
		requested_file += 'index.html';
	}

	console.log('Server static content ' + requested_file);
	res.sendFile(__dirname + '/webroot' + requested_file);
});

// Start app code
io.on('connection', function (socket) {

	// generate random side
	var sizes = ['left', 'right', 'top', 'down'];
	// shout for that side
	setInterval(function () {
		socket.emit('sizes', {size: sizes[Math.floor(Math.random() * 4)]});
	}, 10000);
	
	// socket.emit('subscribe', 1);

	// create a room
	socket.on('createRoom', function (data) {
		var newRoom = new rooms.rooms( { name: data.room, total_players: 5, gridx:5, gridy:5, number_of_players:1 } );
		rooms_list.push(newRoom);

		socket.join(data.room);

		socket.emit('createRoom','You are in room ' + data.room);

		var i=0; var room_names="";
		while (i<rooms_list.length) {
		    room_names+=rooms_list[i].getRoomName()+",";
		    i++;
		}
		socket.emit('createRoom','List of all rooms ' + room_names);
	});

	// join a room
	socket.on('joinRoom', function (data) {
		// check for existing room
		var i=0; var room_found=0;
		while (i<rooms_list.length) {
	    	if (rooms_list[i].getRoomName()===data.room) {
	    		room_found=1; 
	    		break;
	    	}
	    	i++;
		}

		// if room exists
		if (room_found===1) {
			// if room is full
			if (rooms_list[i].isFull()) {
				socket.emit('joinRoom',data.room+' is full');
			} else {
				socket.join(data.room);
				rooms_list[i].setOneMorePlayer();
				socket.emit('joinRoom','You are in room ' + data.room);
			}
		} else {
			socket.emit('joinRoom','Room with that name does not exists: ' + data.room);
		}
	});


	socket.on('leaveRoom', function (data) {
		socket.leave(data.room);
		socket.emit('leaveroom','You just left room ' + data.room);
	});

});
