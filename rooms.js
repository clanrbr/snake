function Rooms (data) {
	this.roomid=0 | data.roomid;
    this.name = data.name;
    this.total_players = data.total_players;
    this.gridx = data.gridx;
    this.gridy = data.gridy;
    this.number_of_players=data.number_of_players;

    // get the name of the room
    this.getRoomName = function() {
        return this.name;
    };
    this.setOneMorePlayer = function() {
        this.number_of_players++;
    };
    this.removeOnePlayer = function() {
        this.number_of_players--;
    };
    this.isFull = function() {
        if (this.total_players===this.number_of_players)
        	return true;
        
        return false;
    };
}

module.exports = {'rooms':Rooms};