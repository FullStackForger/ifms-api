var Hapi = require('hapi'),
    Code = require('code'),
    expect = Code.expect,
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.describe,
    it = lab.it,
    before = lab.before,
    after = lab.after,
	routes = require('../app/routes'),
	testReply = "end-point created but doesn't have code yet";

describe('Route \/', function () {
    it('should reply with: "' + testReply + '"', function (done) {
		var server = new Hapi.Server();
	    server.connection({ port: 80 });
	    server.route(routes);
	    server.inject({method: 'GET', url: '/'}, function (response) {
		    expect(response.result).equal(testReply);
	    });
        done();
    });
});

describe('Route \/auth', function () {
	it('should reply with: "' + testReply + '"', function (done) {
		var server = new Hapi.Server();
		server.connection({ port: 80 });
		server.route(routes);
		server.inject({method: 'GET', url: '/'}, function (response) {
			expect(response.result).equal(testReply);
		});
		done();
	});
});

describe('Route \/me', function () {
	it('should reply with: "' + testReply + '"', function (done) {
		var server = new Hapi.Server();
		server.connection({ port: 80 });
		server.route(routes);
		server.inject({method: 'GET', url: '/'}, function (response) {
			expect(response.result).equal(testReply);
		});
		done();
	});
});

describe('Route \/score', function () {
	it('should reply with: "' + testReply + '"', function (done) {
		var server = new Hapi.Server();
		server.connection({ port: 80 });
		server.route(routes);
		server.inject({method: 'GET', url: '/'}, function (response) {
			expect(response.result).equal(testReply);
		});
		done();
	});
});