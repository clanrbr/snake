function Board(){
	this.x = null;
	this.y = null;

	this.init = function(x, y){
		this.x = x;
		this.y = y;
	};

	this.get_free_place = function(length, min_distance_to_others){
		return {
			from: {
				x: 5,
				y: 5
			}, to: {
				x: 10,
				y: 5
			}
		};
	};
};

module.exports = {Board: Board};
