var app = require('express')(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	port = 3000;

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
	}, 1000);

	// join a room
	socket.emit('subscribe', 1);
	socket.on('subscribe', function (data) {
		socket.join(data.room);
		socket.emit('You are in room ' + data.room);
	});

	socket.on('unsubscribe', function (data) {
		socket.leave(data.room);
		socket.emit('You just left room ' + data.room);
	});

});
