var Hapi = require('hapi'),
	Good = require('good'),
    Routes = require('./app/routes'),
    server;


server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8080
});

server.register({
	register: require('good'),
	options: {
		reporters: [{
			reporter: require('good-console'),
			args:[{ log: '*', response: '*' }]
		}]
	}
}, function (err) {

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

//server.start();