function Rooms(data) {
	this.name = data.name;
	this.total_players = data.total_players;
	this.gridx = data.gridx;
	this.gridy = data.gridy;
	this.number_of_players = data.number_of_players;
	this.players_list = [];

	// get the name of the room
	this.getRoomName = function () {
		return this.name;
	};
	this.setOneMorePlayer = function (player) {
		this.number_of_players++;
		this.players_list.push(player);
	};
	this.removeOnePlayer = function (player) {
		this.number_of_players--;
		this.players_list.splice(this.players_list.indexOf(player), 1);
	};
	this.isFull = function () {
		if (this.total_players === this.number_of_players)
			return true;

		return false;
	};
	this.already_joined = function (player) {
		return this.players_list.indexOf(player) > -1;
	};
	this.get_statistics = function () {
		return {
			name: this.name,
			current_players: this.number_of_players,
			max_players: this.total_players
		};
	};
}

module.exports = {Rooms: Rooms};
