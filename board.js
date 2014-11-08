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
				x: 100,
				y: 100
			}, to: {
				x: 200,
				y: 120
			}
		};
	};
};

module.exports = {Board: Board};
