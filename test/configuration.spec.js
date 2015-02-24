var Hoek = require('hoek'),
	Code = require('code'),
	Promise = require('mpromise'),

// test suite helpers
	expect = Code.expect,
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	describe = lab.describe,
	it = lab.it,
	beforeEach = lab.beforeEach;

describe('Application configuration', function () {
	
	beforeEach(function (done) {
		//delete require.cache[require.resolve('../app/config')];
		//delete require.cache[require.resolve('../app/config/defaults')];
		done();
	});
	
	it ('should default environment params', function (done) {
		var config;
		
		delete process.env.NODE_ENV;
		delete process.env.NODE_HOST;
		delete process.env.NODE_PORT;
		
		config = require('../app/config').init();
				
		expect(config.env).to.equal('development');
		expect(config.host).to.equal('127.0.0.1');
		expect(config.port).to.equal('8000');
		
		done();
	});

	it ('should detect environment params', function (done) {
		var config;
		
		process.env.NODE_ENV = 'testing';
		process.env.NODE_HOST = 'localhost';
		process.env.NODE_PORT = '3000';

		config = require('../app/config').init();
		
		expect(config.env).to.equal('testing');
		expect(config.host).to.equal('localhost');
		expect(config.port).to.equal('3000');
		
		done();
	});

	it ('should detect invalid environment', function (done) {
		process.env.NODE_ENV = 'invalid env';

		try {
			require('../app/config').init();
		} catch (e) {
			expect(e).to.exist();
			done();
		}
	});
	
});