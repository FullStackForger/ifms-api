module.exports = function () {
	var env = process.env.NODE_ENV || 'development',
		host = process.env.NODE_HOST || '127.0.0.1',
		port = process.env.NODE_PORT || '8001';
	
	return {
		env: env,
		host: host,
		port: port,
		url: "http://" + host + ":" + port,
		facebook : {
			clientId: null,
			clientSecret: null
		},
		mongodb: {
			url: "mongodb://localhost:27017/test",
			opts : {}
		},
		auth: {
			secret: "secret",
			algorithm: "HS256" // on of: https://github.com/brianloveswords/node-jws
		}
	};
};