var Model = require('hapi-app-mongo-model'),
	GameData = Model.register({
		collection: "game_data",
		path: __dirname
	});

module.exports = GameData;