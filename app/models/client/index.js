var Model = require('hapi-app-mongo-model'),
	Client = Model.register({
		collections: "clients",
		path: __dirname
	});

module.exports = Client;