var Config = require('./config/index'),
	plugins = [];

// Facebook authentication
plugins.push({
	register: require('bell')
});

// API document generator
plugins.push({
	register: require('lout')
});

// Hapi process monitoring
plugins.push({
	register: require('good'),
	options: {
		reporters: [{
			reporter: require('good-console'),
			args: [{ log: '*', response: '*', request: '*', error: '*' }]
		}]
	}
});

// Hapi Models
plugins.push({
	register: require('hapi-app-mongo-model').plugin,
	options: {
		"url": Config.mongodb.url,
		"opts": Config.mongodb.opts
	}
});

// JWT authorisation, schema: bearer-access-token
plugins.push({
	register: require('hapi-auth-bearer-token')
});

// Mix Auth, schema: mix-auth
plugins.push({
	register: require('hapi-app-mix-auth')
});


module.exports = plugins;