function validateFunc (token, callback) {
	var request = this;

	// todo: verify token against IP and expiration and user
	if (token === "aaabbbccc-token") {
		callback(null, true, { token: token })
	} else {
		callback(null, false, { token: token })
	}
};

// schema: bearer-access-token
// https://github.com/johnbrett/hapi-auth-bearer-token
module.exports = {
	allowQueryToken: true,              // todo: set from config
	allowMultipleHeaders: false,
	accessTokenName: 'access_token',
	validateFunc : validateFunc
};