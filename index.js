var Hapi = require('hapi'),
    Routes = require('./app/routes'),
	Config = require('./app/config'),	
    server = new Hapi.Server(),
	plugins;

server.connection({
    host: Config.host,
    port: Config.port
});

plugins = [{
		register: require('good'),
		options: {
			reporters: [{
				reporter: require('good-console'),
				args: [{ log: '*', response: '*' }]
			}]
		}
	}, {
		register: require('bell')
	}, {
		register: require('lout') 
}];

server.register(plugins, function (err) {
	
	if (err) {
		console.error(err);
	} else {

		// todo: edd login password based strategy
		server.auth.strategy('facebook', 'bell', {
			provider: 'facebook',
			password: 'password',
			isSecure: false,
			clientId: Config.facebook.clientId,
			clientSecret: Config.facebook.clientSecret,
			providerParams: {
				redirect_uri: server.info.uri + '/auth' // todo: test for wrong end-point
			}
		});
		
		server.route(Routes);
		server.start(function () {
			console.info('Server started at ' + server.info.uri);
		});
	}
});