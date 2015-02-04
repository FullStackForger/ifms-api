/**
 * Application top level namespace
 * @type {{Model: exports}}
 */
var App = {
	Model: require('hapi-app-mongo-model'),
	Config: require('./config'),
	plugins: require('./core/plugins'),
	authStrategies: require('./core/auth-strategies'),
	server: null
};

module.exports = App;