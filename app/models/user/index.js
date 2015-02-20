var Model = require('hapi-app-mongo-model'),
	User = Model.register({
		collections: "users",
		path: __dirname
	});

module.exports = User;