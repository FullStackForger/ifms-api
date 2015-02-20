var Model = require('hapi-app-mongo-model'),
	Game = Model.register({
		collections: "games",
		path: __dirname
	});

module.exports = Game;