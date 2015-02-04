var Config = require('../config'),
	authStrategies = [];

// Bell strategy for Facebook authentication
console.log(Config.url + '/auth');
authStrategies.push({
	name: 'facebook',
	schema: 'bell',
	options: {
		provider: 'facebook',
		password: 'password',
		isSecure: false,
		clientId: Config.facebook.clientId,
		clientSecret: Config.facebook.clientSecret,
		providerParams: {
			redirect_uri: Config.url + '/auth'
		}
	}
});

// hapi-auth-bearer-token strategy for Facebook authentication
authStrategies.push({
	name: 'jwt',
	schema: 'bearer-access-token',
	options: {
		allowQueryToken: true,              // optional, true by default
		allowMultipleHeaders: false,        // optional, false by default
		accessTokenName: 'access_token',    // optional, 'access_token' by default
		validateFunc: function( token, callback ) {
			var request = this;


			if(token === "1234") {
				callback(null, true, { token: token })
			} else {
				callback(null, false, { token: token })
			}
		}
	}
});

module.exports = authStrategies;