var Boom = require('boom'),
	User = require('../models/user'),
	Ctrl;

module.exports = Ctrl = {};

Ctrl.authorise = function (request, reply) {

	reply({
		token: "123asd123"
	});

};

Ctrl.getProfile = function(request, reply) {

	User.findOne(request.query)
		.then(function(data) {
			reply(data);
		})
		.onReject(function(data) {
			reply(Boom.badImplementation(error));
		});
};