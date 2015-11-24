var Code = require('code'),
	
	// test suite helpers
	expect = Code.expect,
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	describe = lab.describe,
	it = lab.it,
	before = lab.before,

	internals = {},

	// test actors
	JWTAuth = require('../app/strategies/jwt-auth'),
	UserRoutes = require('../app/routes/user-routes'),
	helpers = require('./test-helpers/index');

describe('Request to \/user\/profile', function () {
	
	before(function (done) {
		internals.before(done);
	});

	it('should respond with registered user profile', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = internals.url;

		helpers.server.inject(request, function(response) {
			var profile = JSON.parse(response.payload);
			expect(response.statusCode).to.equal(200);
			expect(profile).to.be.an.object();

			expect(profile).to.include(['username']);
			expect(profile.username).to.only.include('KillerMachine');

			expect(profile).to.include(['type']);
			expect(profile.type).to.only.include('registered');

			expect(profile).to.include(['name']);
			expect(profile.name).to.only.include('John Smith');

			expect(profile).to.include(['first_name']);
			expect(profile.first_name).to.only.include('John');

			expect(profile).to.include(['last_name']);
			expect(profile.last_name).to.only.include('Smith');

			expect(profile).to.include(['locale']);
			expect(profile.locale).to.only.include('en-gb');
			done();
		});
		
	});

	it('should respond with guest user profile', function (done) {
		var identSignature = (new Buffer('zzzxxxyyy-2:gid01234', 'utf8').toString('base64')),
			request = {
				method: 'GET',
				headers: {
					authorization: 'Bearer zzzxxxyyy-token-2',
					identification: 'Ident ' + identSignature
				},
				url: internals.url
			};

		helpers.server.inject(request, function(response) {
			var profile = JSON.parse(response.payload);
			expect(response.statusCode).to.equal(200);
			expect(profile).to.be.an.object();
			expect(profile).to.include({
				username: 'Guest 1',
				type: 'guest'
			});
			done();
		});

	});
});

internals.url = '/user/profile';

internals.before = function (done) {
	helpers.initServer({
		strategies : [{
			name: 'jwt-auth',
			scheme: 'bearer-access-token',
			//mode: false,
			options: JWTAuth
		}],
		routes : [
			UserRoutes.profileGET
		]
	}, done);
};