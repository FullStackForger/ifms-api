// Load modules

var Hapi = require('hapi'),
	Bell = require('bell'),
	Request = require('request'),
	Good = require('good'),
	Crypto = require('crypto'),
	plugins = [];

var server = new Hapi.Server();
server.connection({ port: 8000 });

var Config = {
	facebook : {
		clientId: '792772680815526',
		clientSecret: 'fc887256bfe59f6150c62c0b7146a4c6'
	}
}

plugins.push(Bell, {
	register: Good,
	options: {
		reporters: [{
			reporter: require('good-console'),
			args:[{ log: '*', response: '*', errpr: '*' }]
		}]
	}
});

server.register(plugins, function (err) {

	server.auth.strategy('facebook', 'bell', {
		provider: 'facebook',
		password: 'password',
		isSecure: false,
		clientId: Config.facebook.clientId,
		clientSecret: Config.facebook.clientSecret,
		providerParams: {
			redirect_uri: server.info.uri + '/bell'
		}
	});

	server.route({
		method: '*',
		path: '/bell',
		config: {
			auth: 'facebook',
			handler: function (request, reply) {
				reply('<pre>' + JSON.stringify(request.auth, null, 4) + '</pre>');

				var appsecret_proof = Crypto
					.createHmac('sha256', Config.facebook.clientSecret)
					.update(request.auth.credentials.token)
					.digest('hex');
				
				Request.get("https://graph.facebook.com/me?appsecret_proof=" + appsecret_proof, {
					
					//access_token: request.auth.credentials.token,
					//fields: "token_for_business"
				}, function(error, response) {
					reply('<pre>' + JSON.stringify(response, null, 4) + '</pre>');
				});
			}
		}
	});

	server.start(function (err) {
		console.log('Server started at:', server.info.uri);
	});

});