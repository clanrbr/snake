// document.addEventListener("DOMContentLoaded", function(event) { 
  

//   function joinRoom() {


//   }
// });


function joinRoom() {
	socket.emit('message', { my: 'data' });
}	