var Code = require('code'),
	Sinon = require('sinon'),
	Promise = require('mpromise'),

	// test suite helpers
	expect = Code.expect,
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	describe = lab.describe,
	it = lab.it,
	before = lab.before;

	helpers = require('./helpers/index'),
	
	// test actors
	authRoute = require('../app/routes/user-routes').auth;


describe('Route \/user\/auth', function () {

	before(function (done) {
		helpers.initServer(authRoute, done);
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
		helpers.initServer(authRoute, done);
	});

    it('should reply with token for Basic authorisation', function (done) {
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


	it('should not authorise with bad identification signature', function (done) {
		var credentials = 'KillerMachine:password123',
			signature = 'BAD SIGNATURE',
			identString = 'Ident ' + (new Buffer(signature, 'utf8').toString('base64')),
			authString = 'Basic ' + (new Buffer(credentials, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers };

		//authString = 'Basic S2lsbGVyTWFjaGluZTpwYXNzd29yZDEyMw=='
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(500);
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
			expect(response.statusCode).to.equal(500);
			done();
		});
	});
	
});

describe('Route \/user\/auth - guest authorisation', function () {

	before(function (done) {
		helpers.initServer(authRoute, done);
	});
	
	it('should reply with token for Guest authorisation (registered)', function (done) {

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

	it('should reply with token for Guest authorisation (new)', function (done) {
		var signature = 'aaabbbccc:gid01234',
			authString = 'Guest ' + (new Buffer('udid:zzz-xxx-yyy', 'utf8').toString('base64')),
			identString = 'Ident ' + (new Buffer(signature, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers };
		
		//authString = 'Guest dWRpZDp6enoteHh4LWNjYw=='
		helpers.server.inject(request, function(response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});


	it('should not authorise with bad identification signature', function (done) {
		var signature = 'BAD SIGNATURE',
			authString = 'Guest ' + (new Buffer('udid:aaabbbccc', 'utf8').toString('base64')),
			identString = 'Ident ' + (new Buffer(signature, 'utf8').toString('base64')),
			headers = { authorization: authString, identification: identString },
			request = { method: 'GET', url: '/user/auth', headers: headers };

		//authString = 'Guest dWRpZDp6enoteHh4LWNjYw=='
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(500);
			done();
		});
	});

	it('should not authorise request without identification signature', function (done) {
		var authString = 'Guest ' + (new Buffer('udid:aaabbbccc', 'utf8').toString('base64')),
			headers = { authorization: authString },
			request = { method: 'GET', url: '/user/auth', headers: headers };

		//authString = 'Guest dWRpZDp6enoteHh4LWNjYw=='
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(500);
			done();
		});
	});

});

describe('Route \/user\/auth - social authorisation', function () {

	before(function (done) {
		helpers.initServer(authRoute, done);
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