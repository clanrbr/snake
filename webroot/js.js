// document.addEventListener("DOMContentLoaded", function(event) { 
  

//   function joinRoom() {


//   }
// });


function joinRoom() {
	socket.emit('subscribe', { room: 'myroom' });
	console.log('clicked');
}	