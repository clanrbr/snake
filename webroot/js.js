var io_address = 'http://localhost:3000',
	socket = io.connect(io_address);

window.onload = function(){
	socket.emit('rooms_statistics');

	Snake.init();

	socket.on('data', function (data) {
		// move all snakes
		Snake.move(data.size);
	});

	socket.on('message', function (data) {
		console.log(data);
	});

	socket.on('rooms_statistics', function(rooms){
		console.log('rooms_statistics', rooms);
	});

	socket.on('coordinates', function(coordinates){
		Snake.generate_snake(coordinates.from, coordinates.to);
		console.log('coordinates', coordinates);
	});
};
		
function joinRoom(roomnumb) {
//	socket.emit('joinRoom', { room: Math.floor(Math.random()*100) });
	if (roomnumb===1) {
		socket.emit('joinRoom', { room: 'Noobs' });
	} else if (roomnumb===2) {
		socket.emit('joinRoom', { room: 'Mellee' });
	}
	else if (roomnumb===3) {
		socket.emit('joinRoom', { room: 'Deathmatch' });
	}
}

function leaveRoom() {
	socket.emit('leaveRoom', { room: 'Noobs' });
}
