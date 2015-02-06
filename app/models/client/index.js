var Model = require('hapi-app-mongo-model'),
	Client = Model.generate({
		collection: "clients",
		path: __dirname
	});

module.exports = Client;