var App = require('../../hapi-app'),
	User = App.Model.generate("UserModel", __dirname);

module.exports = User;