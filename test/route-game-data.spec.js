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
	dataRoutes = require('../app/routes/game-routes'),
	JWTAuth = require('../app/strategies/jwt-auth'),
	GameData = require('../app/models/game-data');

describe('Route \/game\/data\/{key?} - reading data', function () {

	before(function (done) {
		internals.before(done);
	});

	it('should retrieve existing data', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = internals.url;
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(200);
			expect(JSON.parse(response.payload)).to.deep.include({
				key: 'save_001',
				value: 'sample saved data string'
			});
			done();
		});
	});
	
	it('should return empty for invalid data key', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = '/game/data/non_existent_game_key';

		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(200);
			expect(JSON.parse(response.payload)).to.deep.include({
				key: 'non_existent_game_key',
				value: ''
			});
			done();
		});
	});

	it('should reply with all saved game data', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = '/game/data';

		helpers.server.inject(request, function (response) {
			var payload = JSON.parse(response.payload);
			expect(response.statusCode).to.equal(200);
			expect(payload).to.be.an.array().length(2);
			expect(payload[0].key).to.equal('save_001');
			expect(payload[0].value).to.equal('sample saved data string');
			expect(payload[1].key).to.equal('save_002');
			expect(payload[1].value).to.equal('second sample saved data string');
			done();
		});
	});
});


describe('Route \/game\/data - saving data', function () {

	before(function (done) {
		internals.before(done);
	});
	
	it('should insert new data', function (done) {
		
		var request = helpers.request.getValidRequest(),
			dataToSave = { key: 'save_003', value: 'lorem ipsum'};
		// key param is optional

		request.url = '/game/data';
		request.method = 'POST';
		request.payload = dataToSave;
		
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(200);
			expect(JSON.parse(response.payload)).to.deep.include({
				success: true
			});
			done();
		});
	});

	it('should update existing data', function (done) {
		
		var request = helpers.request.getValidRequest(),
			dataToSave = { key: 'save_002', value: 'lorem ipsum'};
		// key param is optional

		request.url = '/game/data';
		request.method = 'POST';
		request.payload = dataToSave;

		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(200);
			expect(JSON.parse(response.payload)).to.deep.include({
				success: true
			});
			done();
		});
	});

});

internals.url = '/game/data/save_001';

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

