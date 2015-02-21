var Hapi = require('hapi'),
	Promise = require('mpromise'),
	Model = require('hapi-app-mongo-model'),
	MixSchema = require('hapi-app-mix-auth'),
	Config = require('../../app/config'),

	mockData = require('../mocks/mockData'),
	mockConfig = require('../mocks/mockConfig'),
	
	externals = module.exports = {},
	internals = {};

externals.initServer = function (serverData, cb) {
	externals.server = new Hapi.Server();
	externals.server.connection();
	externals.server.register(internals.getPlugins(), function (err) {

		if (!Array.isArray(serverData.routes)) {
			serverData.routes = [serverData.routes];
		}
		if (!Array.isArray(serverData.strategies)) {
			serverData.strategies = [serverData.strategies];
		}

		internals.startServer(serverData)
			.then(internals.prepUsers)
			.then(internals.prepClients)
			.then(internals.prepGames)
			.then(function () {
				cb();
			});
	});
};

internals.getPlugins = function () {
	var plugins = [];

	/*
	 plugins.push({
	 register: require('good'),
	 options: {
	 reporters: [{
	 reporter: require('good-console'),
	 args: [{ log: '*', response: '*', error: '*' }]
	 }]
	 }
	 });
	 */

	plugins.push({
		register: require('hapi-app-mongo-model').plugin,
		options: {
			"url": "mongodb://localhost:27017/test",
			"opts": Config.mongodb.opts
		}
	});
	
	// mix-auth
	plugins.push({
		register: MixSchema
	});

	// JWT authorisation, schema: bearer-access-token
	plugins.push({
		register: require('hapi-auth-bearer-token')
	});


	return plugins;
};

internals.prepUsers = function () {
	var promise = new Promise(),
		Users = Model.db.get('users');

	Users.remove({}, function (error, result) {
		Users.insert(mockData.users, function (error) {
			promise.resolve();
		});
	});

	return promise;
};

internals.prepClients = function () {
	var promise = new Promise(),
		Clients = Model.db.get('clients');

	Clients.remove({}, function () {
		Clients.insert(mockData.clients, function () {
			promise.resolve();
		});
	});

	return promise;
};

internals.prepGames = function () {
	var promise = new Promise(),
		Games = Model.db.get('games');

	Games.remove({}, function () {
		Games.insert(mockData.games, function () {
			promise.resolve();
		});
	});

	return promise;
};

internals.startServer = function (serverData) {
	var promise = new Promise();

	serverData.strategies.forEach(function(strategy) {
		var mode = strategy.mode || false;
		externals.server.auth.strategy(strategy.name, strategy.scheme, mode, strategy.options);
	});
	
	serverData.routes.forEach(function (route) {
		externals.server.route(route);
	});

	externals.server.start(function () {
		promise.resolve();
	});

	return promise;
};