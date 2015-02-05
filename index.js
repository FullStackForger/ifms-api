var Hapi = require('hapi'),
	Config = require('./app/config'),
	plugins = require('./app/app-plugins'),
    server = new Hapi.Server();

server.connection({ host: Config.host, port: Config.port});
server.register(plugins, function (err) {
	
	if (err) {
		throw new Error(err);
	} else {

		server.auth.strategy("facebook", "bell", false, require('./app/strategies/fb-auth'));
		server.auth.strategy("mix", "mix-auth", false, require('./app/strategies/mix-auth'));
		server.auth.strategy("jwt", "bearer-access-token", false, require('./app/strategies/jwt-auth'));

		server.route(require('./app/routes/user-routes'));
		
		server.start(function (error) {
			if (error) {
				throw new Error(error);
			}
			console.log('Server started at ' + server.info.uri);
		});
	}
});
