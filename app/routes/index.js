var path = require('path'),
	fs = require('fs'),
	routes = module.exports = [];

fs.readdirSync(__dirname).forEach(function (file) {
	if (file === 'index.js') return;
	var routeModule = require(path.join(__dirname, file));
	
	for (var route in routeModule) {
		routes.push(routeModule[route]);
	}
});