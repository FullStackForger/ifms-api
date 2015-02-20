var Hapi = require('hapi'),
	Code = require('code'),
	Sinon = require('sinon'),
	Promise = require('mpromise'),

	mockData = require('../test/mocks/mockData'),
	mockConfig = require('../test/mocks/mockConfig'),
	internals = {},

// test actors
	Config = require('../app/config'),
	Model = require('hapi-app-mongo-model'),
	MixSchema = require('hapi-app-mix-auth'),
	MixAuth = require('../app/strategies/mix-auth'),
//UserModel = require('../app/models/user'),
//ClientModel = require('../app/models/client'),
	authRoute = require('../app/routes/user-routes').auth;

internals.getPlugins = function () {
	var plugins = [];


	 plugins.push({
		 register: require('good'),
		 options: {
			 reporters: [{
				 reporter: require('good-console'),
				 args: [{ log: '*', response: '*', error: '*' }]
			 }]
		 }
	 });


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

internals.startServer = function () {
	var promise = new Promise();

	internals.server.auth.strategy("mix-auth", "mix-auth", MixAuth);
	internals.server.route(authRoute);
	internals.server.start(function () {
		promise.resolve();
	});

	return promise;
};

internals.server = new Hapi.Server();
internals.server.connection({ host: Config.host, port: Config.port});
internals.server.register(internals.getPlugins(), function (err) {

	internals.startServer()
		.then(internals.prepUsers)
		.then(internals.prepClients)
		.then(internals.prepGames)
		.then(function () {

			var credentials = 'KillerMachine:password123',
				authString = 'Basic ' + (new Buffer(credentials, 'utf8').toString('base64')),
				identString = (new Buffer('aaabbbccc:gid01234', 'utf8')).toString('base64'),
				headers = { authorization: authString, identificator: identString },
				request = { method: 'GET', url: '/user/auth', headers: headers };
			
			console.log(headers);
			console.log('Server started at ' + internals.server.info.uri);
			

			internals.server.inject(request, function (response) {
				console.log(response.statusCode);
			});
			
		});
});