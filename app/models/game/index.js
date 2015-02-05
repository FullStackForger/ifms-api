var Model = require('hapi-app-mongo-model'),
	Game = Model.generate({
		collection: "games",
		path: __dirname
	});

module.exports = Game;