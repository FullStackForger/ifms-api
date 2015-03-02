var Model = require('hapi-app-mongo-model'),
	GameData = Model.register({
		collection: "data",
		path: __dirname
	});

module.exports = GameData;