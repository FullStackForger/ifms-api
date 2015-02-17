var Model = require('hapi-app-mongo-model'),
	Client = Model.register({
		collection: "clients",
		path: __dirname
	});

module.exports = Client;