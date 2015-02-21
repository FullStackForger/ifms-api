var Hapi = require('hapi'),
	Promise = require('mpromise'),
	Model = require('hapi-app-mongo-model'),
	MixSchema = require('hapi-app-mix-auth'),
	Config = require('../../app/config'),
	MixAuth = require('../../app/strategies/mix-auth'),

	mockData = require('../mocks/mockData'),
	mockConfig = require('../mocks/mockConfig'),
	
	externals = module.exports = {},
	internals = {};

externals.initServer = function (routes, cb) {
	externals.server = new Hapi.Server();
	externals.server.connection();
	externals.server.register(internals.getPlugins(), function (err) {

		if (!Array.isArray(routes)) {
			routes = [routes];
		}

		internals.startServer(routes)
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

	plugins.push({
		register: MixSchema
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

internals.startServer = function (routes) {
	var promise = new Promise();

	externals.server.auth.strategy("mix-auth", "mix-auth", MixAuth);
	
	routes.forEach(function (route) {
		externals.server.route(route);
	});

	externals.server.start(function () {
		promise.resolve();
	});

	return promise;
};