var Model = require('hapi-app-mongo-model'),
	GameData = Model.register({
		collection: "score",
		path: __dirname
	});

module.exports = GameData;