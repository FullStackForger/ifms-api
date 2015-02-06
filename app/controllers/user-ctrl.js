var Boom = require('boom'),
	User = require('../models/user'),
	Ctrl;

module.exports = Ctrl = {};

Ctrl.authorise = function (request, reply) {
	reply(request.auth.credentials);
};

Ctrl.getProfile = function(request, reply) {

	User.findOne(request.query)
		.then(function(data) {
			reply(data);
		})
		.onReject(function(error) {
			reply(Boom.badImplementation(error));
		});
};