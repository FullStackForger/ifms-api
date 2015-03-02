var Hoek = require('hoek'),
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

	helpers = require('./test-helpers/index'),
	internals = {},

	// test actors
	dataRoutes = require('../app/routes/game-routes'),
	JWTAuth = require('../app/strategies/jwt-auth');


describe('Route \/game\/rank\/{scope}/{key}', {only: true}, function () {

	before(function (done) {
		internals.before(done);
	});

	it('should retrieve correct best score ranking', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = internals.url + '/best/level_1_1';
		helpers.server.inject(request, function (response) {
			var parsed = JSON.parse(response.payload);

			expect(response.statusCode).to.equal(200);
			expect(parsed).to.be.an.object();
			expect(parsed.scope).to.be.equal('best');
			expect(parsed.rank).to.be.equal(2);
			done();
		});
	});

	it('should retrieve correct monthly score ranking', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = internals.url + '/monthly/level_1_1';
		helpers.server.inject(request, function (response) {
			var parsed = JSON.parse(response.payload);

			expect(response.statusCode).to.equal(200);
			expect(parsed).to.be.an.object();
			expect(parsed.scope).to.be.equal('monthly');
			expect(parsed.rank).to.be.equal(2);
			done();
		});
	});

	it('should retrieve correct weekly score ranking', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = internals.url + '/weekly/level_1_1';
		helpers.server.inject(request, function (response) {
			var parsed = JSON.parse(response.payload);

			expect(response.statusCode).to.equal(200);
			expect(parsed).to.be.an.object();
			expect(parsed.scope).to.be.equal('weekly');
			expect(parsed.rank).to.be.equal(2);
			done();
		});
	});

	it('should retrieve correct daily score ranking', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = internals.url + '/daily/level_1_1';
		helpers.server.inject(request, function (response) {
			var parsed = JSON.parse(response.payload);

			expect(response.statusCode).to.equal(200);
			expect(parsed).to.be.an.object();
			expect(parsed.scope).to.be.equal('daily');

			// first mocks score is from yesterday
			expect(parsed.rank).to.be.equal(4);
			done();
		});
	});
});

describe('Route \/game\/rank\/{scope}', function () {

	before(function (done) {
		internals.before(done);
	});
	
	it('should reply with array of best score rankings', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = internals.url + '/best';
		helpers.server.inject(request, function (response) {
			var parsed = JSON.parse(response.payload);

			expect(response.statusCode).to.equal(200);
			expect(parsed).to.be.an.array();
			
			expect(parsed[0]).to.include({
				rank: 0,
				score: 10,
				leader: 2000
			});

			expect(parsed[1]).to.include({
				rank: 1,
				score: 2040,
				leader: 2040
			});
			
			done();
		});
	});

	it('should reply with array of monthly score rankings', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = internals.url + '/monthly';
		helpers.server.inject(request, function (response) {
			var parsed = JSON.parse(response.payload);

			expect(response.statusCode).to.equal(200);
			expect(parsed).to.be.an.array();
			expect(parsed.rank).to.be.equal(2);
			done();
		});
	});

	it('should reply with array of weekly score rankings', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = internals.url + '/weekly';
		helpers.server.inject(request, function (response) {
			var parsed = JSON.parse(response.payload);

			expect(response.statusCode).to.equal(200);
			expect(parsed).to.be.an.array();
			expect(parsed.rank).to.be.equal(2);
			done();
		});
	});

	it('should reply with array of daily score rankings', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = internals.url + '/weekly';
		helpers.server.inject(request, function (response) {
			var parsed = JSON.parse(response.payload);

			expect(response.statusCode).to.equal(200);
			expect(parsed).to.be.an.array();
			expect(parsed.rank).to.be.equal(2);
			done();
		});
	});
});

internals.url = '/game/rank';

internals.before = function (done) {
	helpers.initServer({
		strategies : [{
			name: 'jwt-auth',
			scheme: 'bearer-access-token',
			//mode: false,
			options: JWTAuth
		}],
		routes : [
			dataRoutes.rankGET
		]
	}, done);
};