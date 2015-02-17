var Model = require('hapi-app-mongo-model'),
	GameStore = Model.register({
		collection: "game_stores",
		path: __dirname
	});

module.exports = GameStore;