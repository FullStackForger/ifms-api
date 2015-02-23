var Hoek = require('hoek'),
	Code = require('code'),
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


describe('Route \/game\/score\/{key?} - reading scores', function () {
	
	before(function (done) {
		internals.before(done);
	});

	it('should retrieve existing score', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = internals.url;
		helpers.server.inject(request, function (response) {
			var parsed = JSON.parse(response.payload),
				dataToTest = Hoek.merge({}, internals.existingScoreData);

			dataToTest.daily = 0;
			
			expect(response.statusCode).to.equal(200);
			expect(parsed).to.be.an.object();
			expect(parsed).to.deep.include(dataToTest);
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
			var payload = JSON.parse(response.payload),
				dataToTest = Hoek.merge({}, internals.existingScoreData);

			dataToTest.daily = 0;
			
			expect(response.statusCode).to.equal(200);
			expect(payload).to.be.an.array().length(2);
			expect(payload[0]).to.include(dataToTest);
			expect(payload[1].key).to.equal('level_1_2');
			done();
		});
	});
});


describe('Route \/game\/score - saving scores', function () {
	
	before(function (done) {
		internals.before(done);
	});
	
	it('should insert new data', function (done) {
		
		var request = helpers.request.getValidRequest(),
			dataToSave = { key: internals.newScoreData.key, value: 555};

		request.url = '/game/score';
		request.method = 'POST';
		request.payload = dataToSave;
		
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(200);
			expect(JSON.parse(response.payload)).to.deep.include({
				success: true,
				data: internals.newScoreData
			});
			done();
		});
	});

	it('should update higher yesterday score', function (done) {

		var request = helpers.request.getValidRequest(),
			dataToSave = {key: 'level_1_1', value: 50};

		request.url = '/game/score';
		request.method = 'POST';
		request.payload = dataToSave;

		helpers.server.inject(request, function (response) {
			var parsed = JSON.parse(response.payload);
			expect(response.statusCode).to.equal(200);
			expect(parsed.success).to.be.true;
			expect(parsed.data).to.deep.include({
				daily: 50,
				weekly: 222,
				monthly: 333,
				best: 444
			});
			done();
		});
	});


	it('should not update higher today\'s score', function (done) {

		var request = helpers.request.getValidRequest(),
			dataToSave = {key: 'level_1_1', value: 50};

		request.url = '/game/score';
		request.method = 'POST';
		request.payload = dataToSave;

		helpers.server.inject(request, function (response) {
			var parsed = JSON.parse(response.payload);
			expect(response.statusCode).to.equal(200);
			expect(parsed.success).to.be.true;
			expect(parsed.data).to.deep.include({
				daily: 50,
				weekly: 222,
				monthly: 333,
				best: 444
			});
			done();
		});
	});
	
	it('should only update daily score', function (done) {

		var request = helpers.request.getValidRequest(),
			dataToSave = {key: 'level_1_1', value: 200};

		request.url = '/game/score';
		request.method = 'POST';
		request.payload = dataToSave;

		helpers.server.inject(request, function (response) {
			var parsed = JSON.parse(response.payload);
			expect(response.statusCode).to.equal(200);
			expect(parsed.success).to.be.true;
			expect(parsed.data).to.deep.include({
				daily: 200,
				weekly: 222,
				monthly: 333,
				best: 444
			});
			done();
		});
	});
	

	it('should update daily and weekly score', function (done) {

		var request = helpers.request.getValidRequest(),
			dataToSave = {key: 'level_1_1', value: 300};

		request.url = '/game/score';
		request.method = 'POST';
		request.payload = dataToSave;

		helpers.server.inject(request, function (response) {
			var parsed = JSON.parse(response.payload);

			expect(response.statusCode).to.equal(200);
			expect(parsed.success).to.be.true;
			expect(parsed.data).to.deep.include({
				daily: 300,
				weekly: 300,
				monthly: 333,
				best: 444
			});
			
			done();
		});
	});

	it('should update daily, weekly and monthly score', function (done) {

		var request = helpers.request.getValidRequest(),
			dataToSave = {key: 'level_1_1', value: 400};

		request.url = '/game/score';
		request.method = 'POST';
		request.payload = dataToSave;

		helpers.server.inject(request, function (response) {
			var parsed = JSON.parse(response.payload);
			expect(response.statusCode).to.equal(200);
			expect(parsed.success).to.be.true;
			expect(parsed.data).to.deep.include({
				daily: 400,
				weekly: 400,
				monthly: 400,
				best: 444
			});
			done();
		});
	});

	it('should update all scores', function (done) {

		var request = helpers.request.getValidRequest(),
			dataToSave = {key: 'level_1_1', value: 555},
			dataToCheck = Hoek.merge({}, internals.newScoreData);

		dataToCheck.key = 'level_1_1';
		
		request.url = '/game/score';
		request.method = 'POST';
		request.payload = dataToSave;

		helpers.server.inject(request, function (response) {
			var parsed = JSON.parse(response.payload);
			expect(response.statusCode).to.equal(200);
			expect(parsed.success).to.be.true;
			expect(parsed.data).to.deep.include(dataToCheck);
			done();
		});
	});

});

internals.url = '/game/score/level_1_1';


internals.existingScoreData = {
	key: 'level_1_1',
	daily: 111,
	weekly: 222,
	monthly: 333,
	best: 444
};

internals.newScoreData = {
	key: 'level_99',
	daily: 555,
	weekly: 555,
	monthly: 555,
	best: 555
};

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

