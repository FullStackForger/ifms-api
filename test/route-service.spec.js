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
	serviceRoutes = require('../app/routes/service-routes');

describe('Route \/', function () {

	before(function (done) {
		internals.before(done);
	});

	it('should retrieve status ok', function (done) {
		helpers.server.inject({ method: 'GET', url: '/' }, function (response) {
			var data = JSON.parse(response.payload);
			expect(response.statusCode).to.equal(200);
			expect(data.status).to.equal('ok');
			done();
		});
	});
});

describe('Route \/service\/status', function () {

	before(function (done) {
		internals.before(done);
	});

	it('should retrieve status ok', function (done) {
		helpers.server.inject({ method: 'GET', url: '/service/status' }, function (response) {
			var data = JSON.parse(response.payload);
			expect(response.statusCode).to.equal(200);
			expect(data.status).to.equal('ok');
			done();
		});
	});
});

internals.url = '/service/status';

internals.before = function (done) {
	helpers.initServer({		
		routes : [
			serviceRoutes.serviceStatus,
			serviceRoutes.root
		]
	}, done);
};

