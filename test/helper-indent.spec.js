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

	internals = {},
	
	// actors
	Ident = require('../app/helpers/ident');


describe('indent helper', function () {

	var mockIdentObject = {udid: 'device-udid', pkey: 'game-public-key'},
		mockIdentString = 'Ident ZGV2aWNlLXVkaWQ6Z2FtZS1wdWJsaWMta2V5';
	
	it ('should convert to base64 signature', function (done) {
		expect(Ident.toBase64(mockIdentObject)).to.be.equal(mockIdentString);
		done();
	});

	it ('should parse indent', function (done) {
		expect(Ident.parse(mockIdentString)).to.deep.include(mockIdentObject);
		done();
	});

	it ('should parse returning null for incorrect indent', function (done) {
		var indentString;
		
		// illegal label
		indentString = 'illegal ' + (new Buffer('a:b', 'utf8')).toString('base64');
		expect(Ident.parse(indentString)).to.be.null;

		// no space after label
		indentString = 'Ident' + (new Buffer('a:b', 'utf8')).toString('base64');
		expect(Ident.parse(indentString)).to.be.null;
		
		// no udid
		indentString = 'Ident ' + (new Buffer(':b', 'utf8')).toString('base64');
		expect(Ident.parse(indentString)).to.be.null;

		// no pkey
		indentString = 'Ident ' + (new Buffer('a:', 'utf8')).toString('base64');
		expect(Ident.parse(indentString)).to.be.null;

		// no colon (:)
		indentString = 'Ident ' + (new Buffer('no_colon', 'utf8')).toString('base64');
		expect(Ident.parse(indentString)).to.be.null;
		
		done();
	});
});