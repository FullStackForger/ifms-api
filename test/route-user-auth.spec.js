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

	// test actors
	MixSchema = require('hapi-app-mix-auth'),
	MixAuth = require('../app/strategies/mix-auth'),
	UserModel = require('../app/models/user'),
	ClientModel = require('../app/models/client'),
	plugins = [],
	authRoute = require('../app/routes/user-routes').auth,

	// helpers
	internals = {},
	mocks = {};

describe('Route \/user\/auth', function () {
	var stubs = {},
		server;

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
		register: MixSchema
	});

	before(function (done) {
		server = new Hapi.Server();
		server.connection();

		//server.register(plugins, function (err) {
		server.register(MixSchema, function (err) {

			if (err) {
				throw new Error(err);
			} else {

				server.auth.strategy("mix-auth", "mix-auth", true, MixAuth);
				server.route(authRoute);

				server.start(function (error) {
					if (error) { throw new Error(error); }
					done();
				});
			}
		});

	});

	beforeEach(function (done) {
		stubs = {
			authValidateFunc: Sinon.stub(MixAuth, "validateFunc", mocks.authValidateFunc),
			//todo: Model has to rebuild to allow multiple stubs
			//findOneUser: Sinon.stub(UserModel, "findOne", mocks.findOneUser)
			findOneClient: Sinon.stub(ClientModel, "findOne", mocks.findOneClient),
			insertClient: Sinon.stub(ClientModel, "insert", mocks.insertClient),
			updateClient: Sinon.stub(ClientModel, "update", mocks.updateClient)
		};
		done();
	});

	afterEach(function(done) {
		stubs.authValidateFunc.restore();
		//stubs.findOneUser.restore();
		stubs.findOneClient.restore();
		stubs.insertClient.restore();
		stubs.updateClient.restore();
		done();
	});

    it('should reply with token on successful Basic authorisation', {skip: true}, function (done) {
	    server.inject({method: 'GET', url: '/user/auth'}, function (response) {
		    expect(response.statusCode).to.equal(200);
		    done();
	    });
    });

	it('should reply with token on successful Oauth authorisation', {skip: true}, function (done) {
		server.inject({method: 'GET', url: '/user/auth'}, function (response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('should reply with token on successful Guest authorisation (registered)', function (done) {
		var request = { method: 'GET', url: '/user/auth', headers: { 
			authorization: 'Guest ' + (new Buffer('udid:registered11111', 'utf8').toString('base64'))
		}};
		
		server.inject(request, function(response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('should reply with token on successful Guest authorisation (new)', function (done) {
		var request = { method: 'GET', url: '/user/auth', headers: {
			authorization: 'Guest ' + (new Buffer('udid:firsttime000000', 'utf8').toString('base64'))
		}};

		server.inject(request, function(response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
	
});

mocks.authValidateFunc = function (method, authObject, callback) {
	if (token === "1234") {
		callback(null, true, { token: token })
	} else {
		callback(null, false, { token: token })
	}
};

mocks.findOneUser = function() {
	return new Promise().fulfill(new UserModel({ _id: 1111, uname: "john", fname: "John", lname: "Smith" }));
};

mocks.updateClient = function(query, data) {
	var promise = new Promise();
	
	if (query._id === '232323') {
		promise.fulfill(1);
	} else {
		promise.fulfill(0);
	}
	
	return promise;
};

mocks.findOneClient = function(query) {
	var promise = new Promise();	
	
	setTimeout(function mockDbQuery() {
		
		if (query.udid === 'registered11111') {
			promise.fulfill(new ClientModel({ _id: 2222, udid: "000000111"}));
		} else {
			promise.fulfill(null);
		}
		
	});
	
	return promise;
};

mocks.insertClient = function(data) {
	var promise = new Promise();
	
	setTimeout(function imitateInsert() {
		data._id = 232323;
		promise.fulfill(new ClientModel(data));
	});
	
	return promise;
};