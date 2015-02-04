var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 8080 });

server.register(require('hapi-auth-bearer-token'), function (err) {

	server.auth.strategy('simple', 'bearer-access-token', {
		allowQueryToken: true,              // optional, true by default
		allowMultipleHeaders: false,        // optional, false by default
		accessTokenName: 'access_token',    // optional, 'access_token' by default
		validateFunc: function( token, callback ) {

			// For convenience, the request object can be accessed
			// from `this` within validateFunc.
			var request = this;

			// Use a real strategy here,
			// comparing with a token from your database for example
			if(token === "1234"){
				callback(null, true, { token: token })
			} else {
				callback(null, false, { token: token })
			}
		}
	});
});

server.route({
	method: 'GET',
	path: '/',
	handler: function (request, reply) {
		reply('success');
	},
	config: { auth: 'simple' }
});

server.start(function () {
	console.log('Server started at: ' + server.info.uri);
})