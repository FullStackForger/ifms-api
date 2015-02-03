var App = require('../../app-index'),
	User = App.Model.generate({
		collection: "users",
		path: __dirname
	});

module.exports = User;