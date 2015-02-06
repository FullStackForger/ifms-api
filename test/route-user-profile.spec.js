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
	JWTSchema = require('hapi-auth-bearer-token'),
	JWTAuth = require('../app/strategies/jwt-auth'),
	UserModel = require('../app/models/user'),
	ClientModel = require('../app/models/client'),
	//plugins = require('../app/app-plugins'), // only bearer-access-token is needed
	plugins = [];
	routes = require('../app/routes/user-routes'),

	// helpers
	internals = {},
	mocks = {};

describe('Request to \/user\/profile', function () {
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
		register: JWTSchema
	});

	before(function (done) {
		server = new Hapi.Server();
		server.connection();

		//server.register(plugins, function (err) {
		server.register(JWTSchema, function (err) {

			if (err) {
				throw new Error(err);
			} else {

				server.auth.strategy("jwt", "bearer-access-token", true, JWTAuth);
				server.route(routes);

				server.start(function (error) {
					if (error) { throw new Error(error); }
					console.log('Server started at ' + server.info.uri);
					done();
				});
			}
		});

	});

	beforeEach(function (done) {
		stubs = {
			authValidateFunc: Sinon.stub(JWTAuth, "validateFunc", mocks.authValidateFunc),
			findOneUser : Sinon.stub(UserModel, "findOne", mocks.findOneUser)
			//todo: Model has to rebuild
			//findOneClient : Sinon.stub(ClientModel, "findOne", mocks.findOneClient)
		};
		done();
	});

	afterEach(function(done) {
		stubs.authValidateFunc.restore();
		stubs.findOneUser.restore();
		//stubs.findOneClient.restore();
		done();
	});
	
	it('should respond with error when not authorised (missing authorization header)', function (done) {
		
		var request = { method: 'GET', url: '/user/profile'};
		server.inject(request, function(response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
		
	});

	it('should respond with error when not authorised (invalid token)', function (done) {

		var request = { method: 'GET', url: '/user/profile'};
		server.inject(request, function(response) {
			expect(response.statusCode).to.equal(401);
			done();
		});

	});

	it('should respond with error when not authorised (missing token)', function (done) {

		var request = { method: 'GET', url: '/user/profile', headers: { authorization: 'Bearer' } };
		server.inject(request, function(response) {
			expect(response.statusCode).to.equal(401);
			done();
		});

	});
	
	it('should respond without an error when authorised', function (done) {

		var request = { method: 'GET', url: '/user/profile', headers: { authorization: 'Bearer 1234' } };
		server.inject(request, function(response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
		
	});

});

mocks.authValidateFunc = function (token, callback) {
	if (token === "1234") {
		callback(null, true, { token: token })
	} else {
		callback(null, false, { token: token })
	}
};

mocks.findOneUser = function() {
	return new Promise().fulfill(new UserModel({ _id: 1111, uname: "john", fname: "John", lname: "Smith" }));
};

mocks.findOneClient = function() {
	return new Promise().fulfill(new ClientModel({ _id: 2222, udid: "0101010"}));
};