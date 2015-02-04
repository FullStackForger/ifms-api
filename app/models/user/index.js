var App = require('../../app-index');
var	User = App.Model.generate({
		collection: "users",
		path: __dirname
	});

module.exports = User;