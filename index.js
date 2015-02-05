var Hapi = require('hapi'),
	Config = require('./app/config'),
	plugins = require('./app/app-plugins'),
    server = new Hapi.Server();

server.connection({ host: Config.host, port: Config.port});
server.register(plugins, function (err) {
	
	if (err) {
		throw new Error(err);
	} else {

		// hapi-auth-bearer-token strategy for Facebook authentication
		// https://github.com/johnbrett/hapi-auth-bearer-token
		server.auth.strategy('jwt', 'bearer-access-token', {
			allowQueryToken: true,              // todo: set from config
			allowMultipleHeaders: false,
			accessTokenName: 'access_token',
			validateFunc: function (token, callback) {
				var request = this;

				// todo: verify token against IP and expiration and user
				if (token === "1234") {
					callback(null, true, { token: token })
				} else {
					callback(null, false, { token: token })
				}
			}
		});

		// hapi-auth-bearer-token strategy for Facebook authentication
		// https://github.com/johnbrett/hapi-auth-bearer-token
		server.auth.strategy('facebook', 'bell', false, {
			provider: 'facebook',
			password: 'password',
			isSecure: false,
			clientId: Config.facebook.clientId,
			clientSecret: Config.facebook.clientSecret,
			providerParams: {
				redirect_uri: Config.url + '/bell'
			}
		});

		server.route(require('./app/routes/user-routes'));
		
		server.start(function (error) {
			if (error) {
				throw new Error(error);
			}
			console.log('Server started at ' + server.info.uri);
		});
	}
});
