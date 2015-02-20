var MongoDB = require('mongodb'),
	Promise = require('mpromise'),
	Hoek = require('hoek'),
	Async = require('async'),
	debug = require('debug')('bench-mongo'),
	mongoUrl = 'mongodb://localhost:27017/benchmark',
	internals = {};

internals.db = null;
internals.collection = {};
internals.dataset = {};
internals.collectionNames = ['users', 'clients', 'games', 'sessions'];

internals.init = function () {

	debug('init');
	internals.connect()
		.then(internals.cleanup)
		.then(function () {
			return internals.populateUsers(1000 * 1000, 2, 2);
		})
		.then(function () {
			return internals.populateClients(1500 * 1000, 2);
		})
		.then(function () {
			return internals.populateSessions(1000 * 1000, 2);
		})
		.then(function () {
			internals.db.close();
			debug('all done!');
		}).onReject(function (err) {
			throw err;
		});
};

internals.connect = function () {
	var promise = new Promise();
	debug('connecting to mongo');
	MongoDB.connect(mongoUrl, function(error, db) {
		if (error)  {
			promise.reject(error);
		}
		internals.db = db;
		debug('connected to mongo');
		promise.fulfill(db);
	});		
	return promise;
};

internals.cleanup = function () {
	var promise = new Promise();

	debug('cleanup');
	Async.map(internals.collectionNames, function (name, next ) {
		internals.db.dropCollection(name, function(error, result) {
			debug('collection cleaned: %s', name);
			next(error);
		});
	}, function () {
		// ignore errors and continue
		promise.resolve();
	});
	return promise;
};

internals.populateUsers = function (numUsers, numClients, numGames) {
	var promise = new Promise(),
		collection = internals.collection,
		users;
	debug('preparing user data set');
	users = internals.dataset.getObjectArray('users', numUsers, {
		clients: internals.dataset.getObjectArray('clients', numClients, {
			games: internals.dataset.getObjectArray('games', numGames)
		}),
		udids: internals.dataset.getStringArray('udid', numClients)
	});
	debug('user data set ready');
	collection.users = internals.db.collection('users');
	debug('inserting users');
	collection.users.insert(users, function (error, result) {
		if (error) promise.reject(error);
		debug('inserted %s users', numUsers);
		debug('creating indexes', numClients);
		collection.users.ensureIndex({name:1}, function (error, indexName) {
			if (error) {
				promise.reject(error);
				return;
			}
			debug('users index %s created', indexName);
			promise.fulfill(result);
		});
		promise.fulfill(result);
	});
	
	return promise;
};

internals.populateClients = function (numClients, numGames) {
	var promise = new Promise(),
		collection = internals.collection,
		clients;
	debug('preparing clients data set');

	clients = internals.dataset.getObjectArray('clients', numClients, {
		games: internals.dataset.getObjectArray('games', numGames)
	});

	debug('client data set ready');
	collection.clients = internals.db.collection('clients');
	debug('inserting clients');
	collection.clients.insert(clients, function (error, result) {
		if (error) promise.reject(error);
		debug('inserted %s clients', numClients);
		debug('creating indexes', numClients);
		collection.clients.ensureIndex({name:1}, function (error, indexName) {
			if (error) {
				promise.reject(error);
				return;
			}
			debug('client index %s created', indexName);
			promise.fulfill(result);	
		});
		
	});

	return promise;
};

internals.populateSessions = function (numClients, numGames) {
	var promise = new Promise(),
		collection = internals.collection,
		sessions;
	debug('preparing sessions data set');

	sessions = internals.dataset.getObjectArray('sessions', numClients);

	debug('sessions data set ready');
	collection.sessions = internals.db.collection('sessions');
	debug('inserting sessions');
	collection.sessions.insert(sessions, function (error, result) {
		if (error) promise.reject(error);
		debug('inserted %s sessions', numClients);
		promise.fulfill(result);
	});

	return promise;
};

internals.dataset.getObjectArray = function (name, qty, props) {
	var data = [],
		i;

	for (i = 0; i < qty; i ++) {
		data.push(Hoek.merge({
			name: name + '_' + i,
			index: 'index_' + i
		}, props || {}));
	}
	
	return data;
};

internals.dataset.getStringArray = function (name, qty) {
	var data = [],
		i;
	
	for (i = 0; i < qty; i ++) {
		data.push(name + '_' + i);
	}

	return data;
	
};

internals.init();