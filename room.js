var Snake = require('./snake.js').Snake;

function Room(data) {
	this.name = data.name;
	this.total_players = data.total_players;
	this.gridx = data.gridx;
	this.gridy = data.gridy;
	this.players_list = [];
	this.snakes_list = [];

	// get the name of the room
	this.getRoomName = function () {
		return this.name;
	};
	this.setOneMorePlayer = function (player) {
		this.players_list.push(player);
		this.snakes_list.push(new Snake());
		// .. generate snake
		// .. send snake
		// and so on
	};
	this.removeOnePlayer = function (player) {
		var player_index = this.players_list.indexOf(player);

		this.players_list.splice(player_index, 1);
		this.snakes_list.splice(player_index, 1);
	};
	this.isFull = function () {
		if (this.total_players === this.getNumberOfPlayers())
			return true;

		return false;
	};
	this.getNumberOfPlayers= function() {
		return this.players_list.length;
	}
	this.already_joined = function (player) {
		return this.players_list.indexOf(player) > -1;
	};
	this.get_statistics = function () {
		return {
			name: this.name,
			current_players: getNumberOfPlayers(),
			max_players: this.total_players
		};
	};
}

module.exports = {Room: Room};
