var Promise = require('mpromise'),
	Boom = require('boom'),
	User = require('../models/user'),
	Game = require('../models/game'),
	GameData = require('../models/game-data'),
	Config = require('../config'),
	JWS = require('jws'),
	secret = "environment_scpecific_secret", //todo: move to config
	Ctrl = module.exports = {},
	internals = {};

Ctrl.getData = function (request, reply) {
	var credentials = request.auth.credentials;
	GameData.findOneAndParse({
		game_id: credentials.game._id,
		client_id: credentials.client._id,
		key: request.params.key
	}).then(function (data) {
		reply({
			key: request.params.key,
			value: data ? data.value || '' : ''
		});
	}).onReject(function (data) {
		reply(Boom.badImplementation('terrible implementation'), null, 'game-ctrl');
	});
};


Ctrl.setData = function (request, reply) {
	reply({});
};