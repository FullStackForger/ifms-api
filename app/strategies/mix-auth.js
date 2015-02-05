var UserModel = require('../models/user'),
	internals = {};

// hapi-app-mix-auth strategy for oath, basic and guest authentication
// https://github.com/johnbrett/hapi-auth-bearer-token
module.exports = {
	name: 'mix-auth', 
	schema: 'hapi-app-mix-auth',
	default: false,
	options: {
		validateFunc : internals.validateFunction
	}
};

internals.validateFunction = function (method, authObject, callback) {
	switch (method) {
		case 'basic':
			Bcrypt.compare(authObject.password, user.password, function (err, isValid) {
				callback(err, isValid, { id: user.id, name: user.name });
			});
			break;
		case 'oauth':
			if (authObject.token === user.token) {
				callback(null, true, { id: user.id, name: user.name });
			}
			break;
		case 'guest':
			if (authObject.udid) {
				callback(null, true, { guest: true, udid: authObject.udid });
			}
			break;
		default:
			return callback(null, false);
			break;
	}
};