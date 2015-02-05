var Config = require('../config');

// todo: it is not part of services
// hapi-auth-bearer-token strategy for Facebook authentication
// https://github.com/johnbrett/hapi-auth-bearer-token
module.exports = {
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
};