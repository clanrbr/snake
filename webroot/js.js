var io_address = 'http://localhost:3000',
	socket = io.connect(io_address),
	Snakes = {};

window.onload = function () {
	socket.emit('rooms_statistics');

	socket.on('data', function (data) {
		for (var i in data) {
			Snakes[i].move(data);
		}
	});

	socket.on('message', function (data) {
		console.log(data);
	});

	socket.on('rooms_statistics', function (rooms) {
		// rooms.filter
		room1=document.getElementById('room1').innerHTML=rooms[0].name;
		document.getElementById('roomname1').innerHTML=rooms[0].name;
		document.getElementById('roomdescription1').innerHTML=rooms[0].description;
		document.getElementById('current_players1').innerHTML=rooms[0].current_players;
		document.getElementById('max_players1').innerHTML=rooms[0].max_players;

		room2=document.getElementById('room2').innerHTML=rooms[1].name;
		document.getElementById('roomname2').innerHTML=rooms[1].name;
		document.getElementById('roomdescription2').innerHTML=rooms[1].description;
		document.getElementById('current_players2').innerHTML=rooms[1].current_players;
		document.getElementById('max_players2').innerHTML=rooms[1].max_players;

		room3=document.getElementById('room3').innerHTML=rooms[2].name;
		document.getElementById('roomname3').innerHTML=rooms[2].name;
		document.getElementById('roomdescription3').innerHTML=rooms[2].description;
		document.getElementById('current_players3').innerHTML=rooms[2].current_players;
		document.getElementById('max_players3').innerHTML=rooms[2].max_players;

		console.log('rooms_statistics', rooms);
	});

	socket.on('coordinates', function (data) {
		console.log('coordinates', data);
		for (var i in data) {
			Snakes[i] = new Snake();
			Snakes[i].init();
			Snakes[i].generate_snake(data[i].snake[data[i].snake.length - 1], data[i].snake[0]);
		}
	});

	window.addEventListener("keydown", function (e) {
		switch (e.keyCode) {
			case 39:
				socket.emit('move', 'right');
				console.log('moved to the right');
				break;
		}
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

function switchScreen(show_screen) {
	begin_screen=document.getElementById('begin_screen');
	input_screen=document.getElementById('input_screen');
	board_screen=document.getElementById('board_screen');

	begin_screen.style.display="none";
	input_screen.style.display="none";
	board_screen.style.display="none";

	if (show_screen===1) {
		input_screen.style.display="block";
	} else if (show_screen===2) {
		board_screen.style.display="block";
	} else {
		begin_screen.style.display="block";
	}
}

function leaveRoom() {
	socket.emit('leaveRoom', {room: 'Noobs'});
}
