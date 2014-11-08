function createRoom() {
	socket.emit('createRoom', { room: Math.floor(Math.random()*100) });
}	
function joinRoom() {
//	socket.emit('joinRoom', { room: Math.floor(Math.random()*100) });
	socket.emit('joinRoom', { room: 'Noobs' });
}	