var Hapi = require('hapi'),
	Good = require('good'),
    Routes = require('./app/routes'),
	Config = require('./app/config'),
	plugins = [],
    server = new Hapi.Server();

server.connection({
    host: Config.host,
    port: Config.port
});

plugins.push({
	register: Good,
	options: {
		reporters: [{
			reporter: require('good-console'),
			args:[{ log: '*', response: '*' }]
		}]
	}
});

plugins.push({ register: require('lout') });

server.register(plugins, function (err) {

	if (err) {
		console.error(err);
	}
	else {
		server.route(Routes);
		server.start(function () {
			console.info('Server started at ' + server.info.uri);
		});
	}
});