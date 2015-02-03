var Boom = require('boom'),
	User = require('../../models/user');

function userDetailsHandler (request, reply) {
	
	User.findOne(request.query)
		.then(function(data) {
			reply(data);
		})
		.onReject(function(data) {
			reply(Boom.badImplementation(error));
		});
}

module.exports = {
	userDetailsHandler: userDetailsHandler
};