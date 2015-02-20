var Model = require('hapi-app-mongo-model'),
	Game = Model.register({
		collection: "games",
		path: __dirname
	});

module.exports = Game;