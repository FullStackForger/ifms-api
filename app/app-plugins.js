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
			args: [{ log: '*', response: '*' }]
		}]
	}
});

// JWT authorisation, schema: bearer-access-token
plugins.push({
	register: require('hapi-auth-bearer-token')
});

// Hapi Models
plugins.push({
	register: require('hapi-app-mongo-model'),
	options: {
		"url": Config.mongodb.url,
		"settings": Config.mongodb.settings
	}
});

module.exports = plugins;