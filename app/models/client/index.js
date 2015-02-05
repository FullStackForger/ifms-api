var Model = require('hapi-app-mongo-model'),
	Client = Model.generate({
		collection: "users",
		path: __dirname
	});

module.exports = Client;