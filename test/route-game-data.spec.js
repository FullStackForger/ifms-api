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


describe('Route \/game\/data', function () {

	before(function (done) {
		internals.before(done);
	});
	
	it('should authorise with valid signature', function (done) {
		var request = helpers.request.getValidRequest();
		request.url = internals.url;
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(200);
			done();
		});
	});
	
	it('should not authorise without token', function (done) {
		var request = helpers.request.getMissingToken();
		request.url = internals.url;
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
	});

	it('should not authorise with illegal token', function (done) {
		var request = helpers.request.getIllegalToken();
		request.url = internals.url;
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
	});

	it('should not authorise without identification signature', function (done) {
		var request = helpers.request.getMissingIdent();
		request.url = internals.url;
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		});
	});
	
	it('should not authorise with invalid identification udid', function (done) {
		var request = helpers.request.getInvalidIdentUDID();
		request.url = internals.url;
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		})
	});

	it('should not authorise with invalid identification pkey', function (done) {
		var request = helpers.request.getInvalidIdentPKey();
		request.url = internals.url;
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		})
	});

	it('should not authorise with illegal identification signature', function (done) {
		var request = helpers.request.getIllegalIndent();
		request.url = internals.url;
		helpers.server.inject(request, function (response) {
			expect(response.statusCode).to.equal(401);
			done();
		})
	});

});

describe('Route \/game\/data - reading data', function () {

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
			dataToSave = { value: 'lorem ipsum'};
		// key param is optional

		request.url = '/game/data/save_003';
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
			dataToSave = { value: 'lorem ipsum'};
		// key param is optional

		request.url = '/game/data/save_002';
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

