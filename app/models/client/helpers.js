var Hoek = require('hoek');

module.exports = {
	addOrUpdateGame : addOrUpdateGame
};

function addOrUpdateGame(game) {
	var founded = false;

	if (!this.games) this.games = [];

	this.games.forEach(function (gameObj) {
		if (gameObj.game_id == game.game_id) {
			founded = false;
			Hoek.applyToDefaults(gameObj, game);
		}
	});

	if (!founded) this.games.push(game);
};