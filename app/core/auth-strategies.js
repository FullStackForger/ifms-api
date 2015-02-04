var Config = require('../config'),
	authStrategies = [];

// Bell strategy for Facebook authentication
// https://github.com/hapijs/bell
console.log(Config.url + '/auth');
authStrategies.push({
	name: 'facebook',
	schema: 'bell',
	default: false,
	options: {
		provider: 'facebook',
		password: 'password',
		isSecure: false,
		clientId: Config.facebook.clientId,
		clientSecret: Config.facebook.clientSecret,
		providerParams: {
			redirect_uri: Config.url + '/bell'
		}
	}
});

// hapi-auth-bearer-token strategy for Facebook authentication
// https://github.com/johnbrett/hapi-auth-bearer-token
authStrategies.push({
	name: 'jwt',
	schema: 'bearer-access-token',
	default: true,
	options: {
		allowQueryToken: true,              // todo: set from config
		allowMultipleHeaders: false,
		accessTokenName: 'access_token',
		validateFunc: function( token, callback ) {
			var request = this;

			// todo: verify token against IP and expiration
			if(token === "1234") {
				callback(null, true, { token: token })
			} else {
				callback(null, false, { token: token })
			}
		}
	}
});

module.exports = authStrategies;