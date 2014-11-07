var app = require('express')(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	port = 3000;

server.listen(port);
console.log('Listening on port ' + port);

// GET /index.html
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

// Start app code
io.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
});
