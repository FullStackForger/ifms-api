module.exports = {
	addOrUpdateGame : addOrUpdateGame
};

function addOrUpdateGame(game) {
	var updated = false;

	if (!this.games) {
		this.games = [];
	}

	this.games.forEach(function (gameObj) {
		if (gameObj.game_id.id == game.game_id.id) {
			gameObj.token = game.token;
			updated = true;
		}
	});

	if (!updated) {
		this.games.push(game);
	}
};