var App = require('../../hapi-app'),
	User = App.Model.generate({
		collection: 'userModel',
		path: __dirname
	});

module.exports = User;