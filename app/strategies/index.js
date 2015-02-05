var path = require('path'),
	fs = require('fs'),
	strats = {};

fs.readdirSync(__dirname).forEach(function (file) {
	if (file === 'index.js') { 
		return; 
	}
	
	strats[path.basename(file, '.js')] = require(path.join(__dirname, file));;
});

module.exports = {};