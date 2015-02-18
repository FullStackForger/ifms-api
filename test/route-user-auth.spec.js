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

		internals.server.register(internals.getPlugins(), function (err) {
			internals
				.prepData()
				.then(internals.startServer)
				.then(done);
		});

	});

    it('should reply with token on successful Basic authorisation', {skip: true}, function (done) {
	    internals.server.inject({method: 'GET', url: '/user/auth'}, function (response) {
		    expect(response.statusCode).to.equal(200);
		    done();
	    });
    });

	it('should reply with token on successful Oauth authorisation', {skip: true}, function (done) {
		internals.server.inject({method: 'GET', url: '/user/auth'}, function (response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('should reply with token on successful Guest authorisation (registered)', function (done) {
		var request = { method: 'GET', url: '/user/auth', headers: { 
			authorization: 'Guest ' + (new Buffer('udid:registered11111', 'utf8').toString('base64'))
		}};
		
		internals.server.inject(request, function(response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('should reply with token on successful Guest authorisation (new)', function (done) {
		var request = { method: 'GET', url: '/user/auth', headers: {
			authorization: 'Guest ' + (new Buffer('udid:firsttime000000', 'utf8').toString('base64'))
		}};

		internals.server.inject(request, function(response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
	
});

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

internals.prepData = function () {	
	var promise = new Promise(),
		Users = Model.db.get('users'),
		Clients = Model.db.get('clients'),
		callCount = 0;

	function tryResolve() {
		callCount ++;
		if (callCount == 2) {
			promise.resolve();
		}
	}
	
	Users.remove({}, function (error, result) {
		Users.insert(mockData.userData, function (error) {
			tryResolve();
		});
	});


	Clients.remove({}, function () {
		Clients.insert(mockData.clientData, function () {
			tryResolve();
		});
	});
	
	return promise;
};

internals.startServer = function () {
	var promise = new Promise();
	internals.server.connection();
	internals.server.auth.strategy("mix-auth", "mix-auth", true, MixAuth);
	internals.server.route(authRoute);
	internals.server.start(function () {
		promise.resolve();
	});
	
	return promise;
};
	