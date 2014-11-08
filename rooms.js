function Rooms (data) {
    this.name = data.name;
    this.players = data.players;
    this.gridx = data.y;
    this.gridy = data.y;
    
    // get the name of the room
    this.getRoomName = function() {
        return this.name;
    };

}