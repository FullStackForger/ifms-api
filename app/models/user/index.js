var Model = require('hapi-app-mongo-model'),
	User = Model.generate({
		collection: "users",
		path: __dirname
	});

module.exports = User;