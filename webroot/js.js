function createRoom() {
	socket.emit('createRoom', { room: Math.floor(Math.random()*100) });
}	
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
