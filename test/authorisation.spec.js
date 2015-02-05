var Hapi = require('hapi'),
    Code = require('code'),
    expect = Code.expect,
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.describe,
    it = lab.it,
    before = lab.before,
    beforeEach = lab.before,
    after = lab.after,
	routes = require('../app/routes/user-routes');

describe('Route \/user\/auth', function () {
	var server;
	
	beforeEach(function(done) {
		server = new Hapi.Server();
		server.connection();
		server.route(routes);
		done();
	});
	
    it('should reply with token on successful basic authorisation', function (done) {
	    server.inject({method: 'GET', url: '/'}, function (response) {

	    });
	    done('fail');
    });

	it('should reply with token on successful oauth authorisation', function (done) {
		server.inject({method: 'GET', url: '/'}, function (response) {

		});
		done('fail');
	});


	it('should reply with token on successful guest authorisation', function (done) {
		server.inject({method: 'GET', url: '/'}, function (response) {
			
		});
		done('fail');
	});
	
});