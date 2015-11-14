var Code = require('code'),
	Sinon = require('sinon'),
	Promise = require('mpromise'),
	Wreck = require('wreck'),

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
	ClientModel = require('../app/models/client'),
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
		    expect(JSON.parse(response.payload).signature).to.be.string();
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
			expect(JSON.parse(response.payload).signature).to.be.string();
			done();
		});
	});

	it('should not authorise for invalid game public key', function (done) {
		var credentials = 'KillerMachine:password123',
			signature = 'new-user-UDID:invalid_game_key',
			authString = 'Basic ' + (new Buffer(credentials, 'utf8').toString('base64')),
			identString = 'Ident ' + (new Buffer(signature, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers };

		//authString = 'Basic S2lsbGVyTWFjaGluZTpwYXNzd29yZDEyMw=='
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			expect(JSON.parse(response.payload)).to.include({
				error: "Unauthorized",
				message: "Invalid game public key"
			});
			done();
		});
	});

	it('should not authorise with invalid password', function (done) {
		var credentials = 'KillerMachine:invalid_password',
			signature = 'aaabbbccc:gid01234',
			authString = 'Basic ' + (new Buffer(credentials, 'utf8').toString('base64')),
			identString = 'Ident ' + (new Buffer(signature, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers };

		//authString = 'Basic S2lsbGVyTWFjaGluZTpwYXNzd29yZDEyMw=='
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
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
			expect(JSON.parse(response.payload).message).to.equal('Missing identification');
			done();
		});
	});

	// reference: https://github.com/hapijs/boom#http-5xx-errors
	it('should reply with bad implementation if code is doing something wrong', function (done) {
		var credentials = 'KillerMachine:password123',
			signature = 'new-user-UDID:gid01234',
			authString = 'Basic ' + (new Buffer(credentials, 'utf8').toString('base64')),
			identString = 'Ident ' + (new Buffer(signature, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers };


		// we simulating behaviour of broken database
		var saveStub = Sinon.stub(UserModel.prototype.__proto__, "save", function () {
			return (new Promise()).reject(new Error('this is EXPECTED bad implementation (5.x.x) error'));
		});

		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(500);
			saveStub.restore();
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
			expect(JSON.parse(response.payload).signature).to.be.string();
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
			expect(JSON.parse(response.payload).signature).to.be.string();
			done();
		});
	});
	
	it('should not authorise Guest client without identification', function (done) {
		var authSignature = 'udid:zzz-xxx-yyy',
			authString = 'Guest ' + (new Buffer(authSignature, 'utf8').toString('base64')),
			headers = { authorization: authString },
			request = { method: 'GET', url: '/user/auth', headers: headers };

		//authString = 'Guest dWRpZDp6enoteHh4LWNjYw=='
		helpers.server.inject(request, function(response) {
			expect(response.statusCode).to.equal(401);
			expect(JSON.parse(response.payload).message).to.equal('Missing identification');
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

	it('should not authorise for invalid game public key', function (done) {
		var authSignature = 'udid:zzz-xxx-yyy',
			indentSignature = 'zzz-xxx-yyy:invalid_key',
			authString = 'Guest ' + (new Buffer(authSignature, 'utf8').toString('base64')),
			identString = 'Ident ' + (new Buffer(indentSignature, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers };

		//authString = 'Guest dWRpZDp6enoteHh4LWNjYw=='
		helpers.server.inject(request, function(response) {
			expect(response.statusCode).to.equal(401);
			expect(JSON.parse(response.payload)).to.include({
				error: "Unauthorized",
				message: "Invalid game public key"
			});
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

	it('should reply with bad implementation upon db error', function (done) {
		var authSignature = 'udid:new-user-UDID',
			indentSignature = 'new-user-UDID:gid01234',
			authString = 'Guest ' + (new Buffer(authSignature, 'utf8').toString('base64')),
			identString = 'Ident ' + (new Buffer(indentSignature, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers },

			findAndModifyStub = Sinon.stub(ClientModel, "findAndModify", function (query, opts, cb) {
				cb(new Error('this is EXPECTED bad implementation (5.x.x) error'), null);
			});

		helpers.server.inject(request, function (response) {
			findAndModifyStub.restore();
			
			expect(response.statusCode).to.equal(500);
			done();
		});
	});

});

describe('Route \/user\/auth - social authorisation', function () {

	before(function (done) {
		internals.before(done);
	});
	
	it('should reply with token', function (done) {
		var fbToken = 'fb_valid_token_111',
			authString = 'Oauth ' + (new Buffer('facebook:' + fbToken, 'utf8').toString('base64')),
			signature = 'new-user-UDID:gid01234',
			identString = 'Ident ' + (new Buffer(signature, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers },
			stub = Sinon.stub(Wreck, "get", internals.stubs.wreckGet);

		helpers.server.inject(request, function(response) {
			stub.restore();
			expect(response.statusCode).to.equal(200);
			expect(JSON.parse(response.payload).signature).to.be.string();
			done();
		});
	});

	it('should not authorise request without identification signature', function (done) {
		var fbToken = 'fb_valid_token_111',
			authString = 'Oauth ' + (new Buffer('facebook:' + fbToken, 'utf8').toString('base64')),
			headers = { authorization: authString },
			request = { method: 'GET', url: '/user/auth', headers: headers },
			stub = Sinon.stub(Wreck, "get", internals.stubs.wreckGet);

		helpers.server.inject(request, function(response) {
			stub.restore();
			expect(response.statusCode).to.equal(401);
			expect(JSON.parse(response.payload).message).to.equal('Missing identification');
			done();
		});

	});

	it('should not authorise for invalid game public key', function (done) {
		var fbToken = 'fb_valid_token_111',
			authString = 'Oauth ' + (new Buffer('facebook:' + fbToken, 'utf8').toString('base64')),
			signature = 'new-user-UDID:invalid_game_key',
			identString = 'Ident ' + (new Buffer(signature, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers },
			stub = Sinon.stub(Wreck, "get", internals.stubs.wreckGet);

		helpers.server.inject(request, function(response) {
			stub.restore();
			expect(response.statusCode).to.equal(401);
			expect(JSON.parse(response.payload)).to.include({
				error: "Unauthorized",
				message: "Invalid game public key"
			});
			done();
		});
	});
	
	it('should reply with error', function (done) {
		var fbToken = 'invalid_token',
			authString = 'Oauth ' + (new Buffer('facebook:' + fbToken, 'utf8').toString('base64')),
			signature = 'new-user-UDID:gid01234',
			identString = 'Ident ' + (new Buffer(signature, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers },
			stub = Sinon.stub(Wreck, "get", internals.stubs.wreckGet);

		helpers.server.inject(request, function(response) {
			stub.restore();
			expect(response.statusCode).to.equal(401);
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


internals.stubs = {};
internals.stubs.wreckGet = function (url, opts, callback) {
	var response = {},
		parts = url.split('='),
		accessToken = parts[parts.length - 1];

	if (accessToken === require('./test-mocks/mockData').users[0].facebook.token) {
		response.statusCode = 200;
		return callback(null, response, JSON.stringify({
			id: '0123456789',
			email: 'user@gmail.com',
			first_name: 'John',
			gender: 'male',
			last_name: 'Smith',
			link: 'https://www.facebook.com/app_scoped_user_id/0123456789',
			locale: 'en_GB',
			name: 'John Smith',
			timezone: 0,
			updated_time: '2014-03-03T16:42:19+0000',
			verified: true
		}));
	}

	response.statusCode = 400;
	callback(null, response, JSON.stringify({
		error : {
			message: 'Invalid OAuth access token.',
			type: 'OAuthException',
			code: 190
		}
	}));
};