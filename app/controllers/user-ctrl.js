var Boom = require('boom'),
	User = require('../models/user'),
	Client = require('../models/client'),
	Config = require('../config'),
	JWS = require('jws'),
	Moment = require('moment'),
	secret = "environment_scpecific_secret", //todo: move to config
	Ctrl = module.exports = {};

Ctrl.authorise = function (request, reply) {

	// todo: support basic authorisation with all below:
	// todo: detect if it is user or client
	// todo: can you make request without UDID? (user only?) or UDID is enforced
	// todo: token should be generated for the  game (if there is an id) or innocentio
	// todo: test all above cases
	
	var client = request.auth.credentials;

	client.agent = request.headers["user-agent"];
	client.token = {};
	// todo: enforce game-id
	client.token.signature = JWS.sign({
		header: { alg: Config.auth.algorithm },
		payload: client.udid,
		secret: Config.auth.secret
	});
	client.token.expiry = Moment().add(60, 'minutes').toDate();

	// todo: want to be able to client.save()
	Client
		.update({_id: client._id}, client)
		.then(function(data) {
			reply({
				token: client.token.signature
			});	
		}, function (error) {
			Boom.badImplementation(error);
		});
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