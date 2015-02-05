// hapi-auth-bearer-token strategy for Facebook authentication
// https://github.com/johnbrett/hapi-auth-bearer-token
var UserModel = require('../models/user'),
	internals = {};

// hapi-app-mix-auth strategy for oath, basic and guest authentication
// https://github.com/johnbrett/hapi-auth-bearer-token
module.exports = {
	name: 'jwt-auth',
	schema: 'bearer-access-token',
	default: false,
	options: {
		allowQueryToken: true,              // todo: set from config
		allowMultipleHeaders: false,
		accessTokenName: 'access_token',
		validateFunc : internals.validateFunc
	}
};

internals.validateFunc = function (token, callback) {
	var request = this;

	// todo: verify token against IP and expiration and user
	if (token === "1234") {
		callback(null, true, { token: token })
	} else {
		callback(null, false, { token: token })
	}
};