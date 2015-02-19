var Hapi = require('hapi'),
	Code = require('code'),
	Sinon = require('sinon'),
	Promise = require('mpromise'),

	// test suite helpers
	expect = Code.expect,
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	describe = lab.describe,
	it = lab.it,
	before = lab.before,
	beforeEach = lab.beforeEach,
	after = lab.after,
	afterEach = lab.afterEach,

	mockData = require('./mocks/mockData'),
	mockConfig = require('./mocks/mockConfig'),
	internals = {},
	
	// test actors
	Config = require('../app/config'),
	Model = require('hapi-app-mongo-model'),
	MixSchema = require('hapi-app-mix-auth'),
	MixAuth = require('../app/strategies/mix-auth'),
	//UserModel = require('../app/models/user'),
	//ClientModel = require('../app/models/client'),
	authRoute = require('../app/routes/user-routes').auth;

describe('Route \/user\/auth', function () {

	before(function (done) {
		
		internals.server = new Hapi.Server();
		internals.server.connection();
		internals.server.register(internals.getPlugins(), function (err) {

			internals.startServer()
				.then(internals.prepUsers)
				.then(internals.prepClients)
				.then(internals.prepGames)
				.then(function () {
					done();
				});
		});

	});

    it('should reply with token for Basic authorisation', {skip: true}, function (done) {
	    var credentials = 'KillerMachine:password123',
		    authString = 'Basic ' + (new Buffer(credentials, 'utf8').toString('base64')),
		    request = { method: 'GET', url: '/usr/auth', headers: { authorization: authString }};
	    
	    //authString = 'Basic S2lsbGVyTWFjaGluZTpwYXNzd29yZDEyMw=='
	    internals.server.inject(request, function (response) {
		    expect(response.statusCode).to.equal(200);
		    done();
	    });
    });

	it('should reply with token for Guest authorisation (registered)', function (done) {
		var authString = 'Guest ' + (new Buffer('udid:aaabbbccc', 'utf8').toString('base64')),
			request = { method: 'GET', url: '/user/auth', headers: { authorization: authString }};

		//authString = 'Guest dWRpZDphYWFiYmJjY2M='
		internals.server.inject(request, function(response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('should reply with token for Guest authorisation (new)', function (done) {
		var authString = 'Guest ' + (new Buffer('udid:zzz-xxx-ccc', 'utf8').toString('base64')),
			request = { method: 'GET', url: '/user/auth', headers: { authorization: authString }};
		
		//authString = 'Guest dWRpZDp6enoteHh4LWNjYw=='
		internals.server.inject(request, function(response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('should reply with token on successful Social authorisation (new)', {skip: true}, function (done) {
		var authString = 'Oauth ' + (new Buffer('facebook:zz-xx-cc', 'utf8').toString('base64')),
			request = { method: 'GET', url: '/user/auth', headers: { authorization: authString }};
		console.log(authString);
		internals.server.inject(request, function(response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
	
});

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

internals.startServer = function () {
	var promise = new Promise();

	internals.server.auth.strategy("mix-auth", "mix-auth", MixAuth);
	internals.server.route(authRoute);
	internals.server.start(function () {
		promise.resolve();
	});
	
	return promise;
};