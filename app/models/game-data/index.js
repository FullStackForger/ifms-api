var Model = require('hapi-app-mongo-model'),
	GameStore = Model.register({
		collection: "games_data",
		path: __dirname
	});

module.exports = GameStore;