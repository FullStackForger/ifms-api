var Code = require('code'),
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
	gameRoutes = require('../app/routes/game-routes'),
	JWTAuth = require('../app/strategies/jwt-auth');

describe('Route \/game\/details', function () {

	before(function (done) {
		internals.before(done);
	});

	it('should retrieve game details', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = internals.url;
		helpers.server.inject(request, function (response) {
			var game = JSON.parse(response.payload);
			expect(response.statusCode).to.equal(200);
						
			expect(game).to.deep.include({
				title: 'Killer Blood',
				description: 'super killer gangsta game'
			});
			expect(game.version).to.be.string();
			expect(game.updated).to.be.string();
			done();
		});
	});
});

internals.url = '/game/details';

internals.before = function (done) {
	helpers.initServer({
		strategies : [{
			name: 'jwt-auth',
			scheme: 'bearer-access-token',
			//mode: false,
			options: JWTAuth
		}],
		routes : [
			gameRoutes.detailsGET
		]
	}, done);
};

