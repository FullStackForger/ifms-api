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
	JWTAuth = require('../app/strategies/jwt-auth'),
	GameData = require('../app/models/game-data');


describe('Route \/game\/score - reading scores', function () {

	var scoreData0 = {
		key: 'level_1_1',
		daily: 123,
		weekly: 222,
		monthly: 222,
		best: 245
	};
	
	before(function (done) {
		internals.before(done);
	});

	it('should retrieve existing score', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = internals.url;
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(200);
			expect(JSON.parse(response.payload)).to.deep.include(scoreData0);
			done();
		});
	});
	
	it('should return zero score for invalid data key', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = '/game/score/non_existent_game_key';

		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(200);
			expect(JSON.parse(response.payload)).to.deep.include({
				key: 'non_existent_game_key',
				daily: 0,
				daily: 0,
				monthly: 0,
				best: 0
			});
			done();
		});
	});

	it('should reply with all saved user scores', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = '/game/score';

		helpers.server.inject(request, function (response) {
			var payload = JSON.parse(response.payload);
			expect(response.statusCode).to.equal(200);
			expect(payload).to.be.an.array().length(2);
			expect(payload[0]).to.include(scoreData0);
			expect(payload[1].key).to.equal('level_1_2');
			done();
		});
	});
});


describe('Route \/game\/data - saving scores', function () {

	before(function (done) {
		internals.before(done);
	});
	
	it('should insert new data', function (done) {
		
		var request = helpers.request.getValidRequest(),
			dataToSave = { value: 444};
		// key param is optional

		request.url = '/game/score/level_1_3';
		request.method = 'POST';
		request.payload = dataToSave;
		
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(200);
			expect(JSON.parse(response.payload)).to.deep.include({
				success: true,
				data: {
					key: 'level_1_2',
					daily: 444,
					daily: 444,
					monthly: 444,
					best: 444
				}
			});
			done();
		});
	});

	it('should update existing data', function (done) {
		
		var request = helpers.request.getValidRequest(),
			dataToSave = { value: 666};
		// key param is optional

		request.url = '/game/score/level_1_2';
		request.method = 'POST';
		request.payload = dataToSave;

		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(200);
			expect(JSON.parse(response.payload)).to.deep.include({
				success: true,
				data: {
					key: 'level_1_2',
					daily: 666,
					daily: 666,
					monthly: 666,
					best: 666
				}
			});
			done();
		});
	});

});

internals.url = '/game/score/level_1_1';

internals.before = function (done) {
	helpers.initServer({
		strategies : [{
			name: 'jwt-auth',
			scheme: 'bearer-access-token',
			//mode: false,
			options: JWTAuth
		}],
		routes : [
			dataRoutes.scoreGET,
			dataRoutes.scorePOST
		]
	}, done);
};

