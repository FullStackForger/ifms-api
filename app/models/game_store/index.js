var Model = require('hapi-app-mongo-model'),
	GameStore = Model.register({
		collections: "game_stores",
		path: __dirname
	});

module.exports = GameStore;