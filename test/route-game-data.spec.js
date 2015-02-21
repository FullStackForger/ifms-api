var Code = require('code'),
	Sinon = require('sinon'),
	Promise = require('mpromise'),

	// test suite helpers
	expect = Code.expect,
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	describe = lab.describe,
	it = lab.it,
	before = lab.before,

	helpers = require('./helpers/index'),
	internals = {},

	// test actors
	dataRoutes = require('../app/routes/game-routes'),
	JWTAuth = require('../app/strategies/jwt-auth');


describe('Route \/game\/data', function () {

	before(function (done) {
		helpers.initServer({
			strategies : [{
				name: 'jwt-auth',
				scheme: 'bearer-access-token',
				//mode: false,
				options: JWTAuth
			}],
			routes : [
				dataRoutes.dataGET, 
				dataRoutes.dataPOST
			]			
		}, done);
	});

	it('should authorise with valid signature', function (done) {
		var request = internals.request.validRequest;
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('should not authorise without valid game public key', function (done) {
		var request = internals.request.missingToken;
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
	});
	
	it('should not authorise without token', function (done) {
		var request = internals.request.missingToken;
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
	});

	it('should not authorise with illegal token', function (done) {
		var request = internals.request.illegalToken;
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
	});

	it('should not authorise without identification signature', function (done) {
		var request = internals.request.missingIdent;
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
	});
	
	it('should not authorise with invalid identification udid', function (done) {
		var request = internals.request.invalidIdentUDID;
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		})
	});

	it('should not authorise with invalid identification pkey', function (done) {
		var request = internals.request.invalidIdentPKey;
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		})
	});

	it('should not authorise with illegal identification signature', function (done) {
		var request = internals.request.illegalIndent;
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		})
	});


});

internals.url = '/game/data';
internals.getValidAuth = function () {
	return 'Bearer aaabbbccc-token';
};

internals.getInvalidAuth = function () {
	return 'Bearer invalid-token';
};

internals.getIllegaAuth= function () {
	return 'illegal-token';
};

internals.getValidIdent = function () {
	return 'Ident ' + (new Buffer('aaabbbccc:gid01234', 'utf8').toString('base64'));
};

internals.getInvalidIdentUDID = function () {
	return 'Ident ' + (new Buffer('bad_udid:gid01234', 'utf8').toString('base64'));
};

internals.getInvalidIdentPKey = function () {
	return 'Ident ' + (new Buffer('aaabbbccc:bad_pkey', 'utf8').toString('base64'));
};

internals.getIllegalIndent= function () {
	return 'Ident ' + (new Buffer('illegal-indent', 'utf8').toString('base64'));
};



internals.request = {};
internals.request.validRequest = {
	method: 'GET', 
	url: internals.url,
	headers: {
		authorization: internals.getValidAuth(),
		identification: internals.getValidIdent()			
	}
};
internals.request.illegalIndent = {
	method: 'GET',
	url: internals.url,
	headers: {
		authorization: internals.getValidAuth(),
		identification: internals.getIllegalIndent()
	}
};
internals.request.illegalToken = {
	method: 'GET',
	url: internals.url,
	headers: {
		authorization: internals.getIllegaAuth(),
		identification: internals.getValidIdent()
	}
};
internals.request.invalidIdentUDID = {
	method: 'GET',
	url: internals.url,
	headers: {
		authorization: internals.getValidAuth(),
		identification: internals.getInvalidIdentUDID()
	}
};

internals.request.invalidIdentPKey = {
	method: 'GET',
	url: internals.url,
	headers: {
		authorization: internals.getValidAuth(),
		identification: internals.getInvalidIdentPKey()
	}
};

internals.request.missingIdent = {
	method: 'GET',
	url: internals.url,
	headers: {
		authorization: internals.getValidAuth()
	}
};
internals.request.missingToken = {
	method: 'GET',
	url: internals.url,
	identification: internals.getValidIdent()
};