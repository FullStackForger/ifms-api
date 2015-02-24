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

	helpers = require('./test-helpers/index'),
	internals = {},
		
	// test actors
	UserModel = require('../app/models/user'),
	MixAuth = require('../app/strategies/mix-auth'),
	authRoute = require('../app/routes/user-routes').auth;



describe('Route \/user\/auth', function () {

	before(function (done) {
		internals.before(done);
	});

	it('should not authorise without credentials', function (done) {
		var request = { method: 'GET', url: '/user/auth' };

		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
	});
	
});

describe('Route \/user\/auth - basic authorisation', function () {

	before(function (done) {
		internals.before(done);
	});

	// note: this test has been moved outside as it was logging errors
	it('should reply with bad implementation for new client of registered user', function (done) {
		var credentials = 'KillerMachine:password123',
			signature = 'new-user-UDID:gid01234',
			authString = 'Basic ' + (new Buffer(credentials, 'utf8').toString('base64')),
			identString = 'Ident ' + (new Buffer(signature, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers },

			saveStub = Sinon.stub(UserModel.prototype.__proto__, "save", function () {
				//throw new Error('something cracked!');
				return (new Promise()).reject(new Error('kabbooooom'));
			});

		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(500);
			saveStub.restore();
			done();
		});
	});
});

describe('Route \/user\/auth - basic authorisation', function () {

	before(function (done) {
		internals.before(done);
	});

    it('should reply with token for registered user', function (done) {
	    var credentials = 'KillerMachine:password123',
		    signature = 'aaabbbccc:gid01234',
		    authString = 'Basic ' + (new Buffer(credentials, 'utf8').toString('base64')),
		    identString = 'Ident ' + (new Buffer(signature, 'utf8').toString('base64')),
		    headers = { authorization: authString, identification: identString },
		    request = { method: 'GET', url: '/user/auth', headers: headers };
	    
	    //authString = 'Basic S2lsbGVyTWFjaGluZTpwYXNzd29yZDEyMw=='
	    helpers.server.inject(request, function (response) {
		    expect(response.statusCode).to.equal(200);
		    done();
	    });
    });

	it('should reply with token for new client of registered user', function (done) {
		var credentials = 'KillerMachine:password123',
			signature = 'new-user-UDID:gid01234',
			authString = 'Basic ' + (new Buffer(credentials, 'utf8').toString('base64')),
			identString = 'Ident ' + (new Buffer(signature, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers };

		//authString = 'Basic S2lsbGVyTWFjaGluZTpwYXNzd29yZDEyMw=='
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
	
	it('should not authorise with bad identification signature', function (done) {
		var credentials = 'KillerMachine:password123',
			signature = 'BAD SIGNATURE',
			identString = 'Ident ' + (new Buffer(signature, 'utf8').toString('base64')),
			authString = 'Basic ' + (new Buffer(credentials, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers };

		//authString = 'Basic S2lsbGVyTWFjaGluZTpwYXNzd29yZDEyMw=='
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
	});
	
	it('should not authorise request without identification signature', function (done) {
		var credentials = 'KillerMachine:password123',
			authString = 'Basic ' + (new Buffer(credentials, 'utf8').toString('base64')),
			headers = { authorization: authString },
			request = { method: 'GET', url: '/user/auth', headers: headers };

		//authString = 'Basic S2lsbGVyTWFjaGluZTpwYXNzd29yZDEyMw=='
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
	});
	
});

describe('Route \/user\/auth - guest authorisation', function () {

	before(function (done) {
		internals.before(done);
	});
	
	it('should reply with token for registered Guest client', function (done) {

		var signature = 'aaabbbccc:gid01234',
			authString = 'Guest ' + (new Buffer('udid:aaabbbccc', 'utf8').toString('base64')),
			identString = 'Ident ' + (new Buffer(signature, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers };

		//authString = 'Guest dWRpZDphYWFiYmJjY2M='
		helpers.server.inject(request, function(response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('should reply with token for new Guest client', function (done) {
		var authSignature = 'udid:zzz-xxx-yyy',
			indentSignature = 'zzz-xxx-yyy:gid01234',
			authString = 'Guest ' + (new Buffer(authSignature, 'utf8').toString('base64')),
			identString = 'Ident ' + (new Buffer(indentSignature, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers };

		//authString = 'Guest dWRpZDp6enoteHh4LWNjYw=='
		helpers.server.inject(request, function(response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('should not authorise for inconsistent signatures', function (done) {
		var authSignature = 'udid:zzz-xxx-yyy',
			identSignature = 'aaabbbccc:gid01234',
			authString = 'Guest ' + (new Buffer(authSignature, 'utf8').toString('base64')),
			identString = 'Ident ' + (new Buffer(identSignature, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers };

		//authString = 'Guest dWRpZDp6enoteHh4LWNjYw=='
		helpers.server.inject(request, function(response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
	});

	it('should not authorise for invalid signature', function (done) {
		var signature = 'zzz-xxx-yyy:INVALID_GAME_ID',
			authString = 'Guest ' + (new Buffer('udid:aaabbbccc', 'utf8').toString('base64')),
			identString = 'Ident ' + (new Buffer(signature, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers };

		//authString = 'Guest dWRpZDp6enoteHh4LWNjYw=='
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
	});
	
	it('should not authorise for illegal signature', function (done) {
		var signature = 'BAD SIGNATURE',
			authString = 'Guest ' + (new Buffer('udid:aaabbbccc', 'utf8').toString('base64')),
			identString = 'Ident ' + (new Buffer(signature, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers };

		//authString = 'Guest dWRpZDp6enoteHh4LWNjYw=='
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
	});

	it('should not authorise request without identification signature', function (done) {
		var authString = 'Guest ' + (new Buffer('udid:aaabbbccc', 'utf8').toString('base64')),
			headers = { authorization: authString },
			request = { method: 'GET', url: '/user/auth', headers: headers };

		//authString = 'Guest dWRpZDp6enoteHh4LWNjYw=='
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
	});

});

describe('Route \/user\/auth - social authorisation', function () {

	before(function (done) {
		internals.before(done);
	});
	
	it('should reply with token on successful Social authorisation (new)', {skip: true}, function (done) {
		var authString = 'Oauth ' + (new Buffer('facebook:zz-xx-cc', 'utf8').toString('base64')),
			request = { method: 'GET', url: '/user/auth', headers: { authorization: authString }};

		helpers.server.inject(request, function(response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
	
});

internals.before = function (done) {
	helpers.initServer({
		strategies : [{
			name: 'mix-auth',
			scheme: 'mix-auth',
			mode: false,
			options: MixAuth
		}],
		routes : authRoute
	}, done);
};