var Boom = require('boom'),
	User = require('../../models/user');

function userDetailsHandler (request, reply) {
	var user = new User({id: "123", email: 'marek@something.com'});

	user
		.validate()
		.then(function() {
			reply(user.toJSON());
		}, function(error) {
			reply(Boom.badImplementation(error));
		});
}

module.exports = {
	userDetailsHandler: userDetailsHandler
};