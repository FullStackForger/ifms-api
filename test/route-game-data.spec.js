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
		internals.before(done);
	});
	
	it('should authorise with valid signature', function (done) {
		var request = internals.request.getValidRequest();
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
	
	it('should not authorise without token', function (done) {
		var request = internals.request.getMissingToken();
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
	});

	it('should not authorise with illegal token', function (done) {
		var request = internals.request.getIllegalToken();
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
	});

	it('should not authorise without identification signature', function (done) {
		var request = internals.request.getMissingIdent();
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
	});
	
	it('should not authorise with invalid identification udid', function (done) {
		var request = internals.request.getInvalidIdentUDID();
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		})
	});

	it('should not authorise with invalid identification pkey', function (done) {
		var request = internals.request.getInvalidIdentPKey();
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		})
	});

	it('should not authorise with illegal identification signature', function (done) {
		var request = internals.request.getIllegalIndent();
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		})
	});

});


internals.before = function (done) {
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
};
internals.toBase64 = function (string) {
	return new Buffer(string, 'utf8').toString('base64');	
};

internals.url = '/game/data/save_001';
internals.validAuth = 'Bearer aaabbbccc-token';
internals.invalidAuth = 'Bearer invalid-token';
internals.illegaAuth = 'illegal-token';
internals.validIdent = 'Ident ' + internals.toBase64('aaabbbccc:gid01234', 'utf8');
internals.invalidIdentUDID = 'Ident ' + internals.toBase64('bad_udid:gid01234', 'utf8');
internals.invalidIdentPKey = 'Ident ' + internals.toBase64('aaabbbccc:bad_pkey', 'utf8');
internals.illegalIndent = 'Ident ' + internals.toBase64('illegal-indent', 'utf8');

internals.request = {};
internals.request.getValidRequest = function () { 
	return {
		method: 'GET', 
		url: internals.url,
		headers: {
			authorization: internals.validAuth,
			identification: internals.validIdent			
		}
	};
};

internals.request.getIllegalIndent = function () {
	return {
		method: 'GET',
		url: internals.url,
		headers: {
			authorization: internals.validAuth,
			identification: internals.illegalIndent
		}
	};
};

internals.request.getIllegalToken = function () {
	return {
		method: 'GET',
		url: internals.url,
		headers: {
			authorization: internals.illegaAuth,
			identification: internals.validIdent
		}
	};
};

internals.request.getInvalidIdentUDID = function () {
	return {
		method: 'GET',
		url: internals.url,
		headers: {
			authorization: internals.validAuth,
			identification: internals.invalidIdentUDID
		}
	};
};

internals.request.getInvalidIdentPKey = function () {
	return {
		method: 'GET',
		url: internals.url,
		headers: {
			authorization: internals.validAuth,
			identification: internals.invalidIdentPKey
		}
	};
};

internals.request.getMissingIdent = function () {
	return {
		method: 'GET',
		url: internals.url,
		headers: {
			authorization: internals.validAuth
		}
	}
};

internals.request.getMissingToken = function () {
	return {
		method: 'GET',
		url: internals.url,
		identification: internals.validIdent
	}
};