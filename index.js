var Hapi = require('hapi'),
	Config = require('./app/config'),
	plugins = require('./app/app-plugins'),
	strategies = require('./app/strategies'),
    server = new Hapi.Server();

server.connection({ host: Config.host, port: Config.port});
server.register(plugins, function (err) {
	
	if (err) {
		throw new Error(err);
	} else {

		for(var strategy in strategies) {
			server.auth.strategy(strategy.name, strategy.schema, strategy.default === true, strategy.options);
		}

		server.route(require('./app/routes/user-routes'));
		
		server.start(function (error) {
			if (error) {
				throw new Error(error);
			}
			console.log('Server started at ' + server.info.uri);
		});
	}
});
