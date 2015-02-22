var Model = require('hapi-app-mongo-model'),
	GameData = Model.register({
		collection: "game_scores",
		path: __dirname
	});

module.exports = GameData;