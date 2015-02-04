var App = require('../../app-index');
var	Client = App.Model.generate({
		collection: "users",
		path: __dirname
	});

module.exports = Client;