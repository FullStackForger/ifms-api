var Model = require('hapi-app-mongo-model'),
	GameStore = Model.generate({
		collection: "game_stores",
		path: __dirname
	});

module.exports = GameStore;