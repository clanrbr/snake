var Snake = require('./snake.js').Snake,
	Board = require('./board.js').Board;

function Room(data) {
	this.Board = new Board();
	this.Board.init(data.gridx, data.gridy);

	this.food = null; // {x: .., y: ..}

	this.name = data.name;
	this.total_players = data.total_players;
	this.gridx = data.gridx;
	this.gridy = data.gridy;
	this.players_list = [];
	this.snakes_list = {};
	this.description = data.description;

	// get the name of the room
	this.getRoomName = function () {
		return this.name;
	};
	this.getNumberOfPlayers = function () {
		return this.players_list.length;
	};
	this.setOneMorePlayer = function (player) {
		var coordinates = this.Board.get_free_place(5, 5);

		this.players_list.push(player);
		this.snakes_list[player] = new Snake();
		this.snakes_list[player].id = player;

		// the last snake (just created)
		this.snakes_list[player].generate_snake(coordinates.from, coordinates.to);
	};
	this.removeOnePlayer = function (player) {
		this.players_list.splice(this.players_list.indexOf(player), 1);
		delete this.snakes_list[player];
	};
	this.isFull = function () {
		return this.getNumberOfPlayers() >= this.total_players;
	};
	this.already_joined = function (player) {
		return this.players_list.indexOf(player) > -1;
	};
	this.get_statistics = function () {
		return {
			name: this.name,
			current_players: this.getNumberOfPlayers(),
			max_players: this.total_players,
			description: this.description,
			gridx: this.gridx,
			gridy: this.gridy
		};
	};
	this.check_free = function (x, y) {
		return this.Board.check_free(x, y, this.snakes_list);
	};

	this.generate_food = function () {
		do{
			x = Math.floor(Math.random() * this.gridx);
			y = Math.floor(Math.random() * this.gridy);
		}
		while(!this.check_free(x, y));

		return {x: x, y: y};
	};
}

module.exports = {Room: Room};
