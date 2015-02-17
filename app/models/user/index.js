var Model = require('hapi-app-mongo-model'),
	User = Model.register({
		collection: "users",
		path: __dirname
	});

module.exports = User;