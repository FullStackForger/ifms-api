var Hapi = require('hapi'),
	App = require('./app/app-index'),
	routes = require('./app/routes'),
    server = App.server = new Hapi.Server();

server.connection({ host: App.Config.host, port: App.Config.port});
server.register(App.plugins, function (err) {
	if (err) {
		throw new Error(err);
	} else {

		// register authorisation strategies
		App.authStrategies.forEach(function(strategy) {
			server.auth.strategy(strategy.name, strategy.schema, strategy.options);
		});

		// register routes
		server.route(routes);
		
		// start server
		server.start(function () {
			console.info('Server started at ' + server.info.uri);
		});
	}
});