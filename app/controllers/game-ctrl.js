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
	
	if (request.params.key) {
		
		GameData.findOneAndParse({
			game_id: credentials.game._id,
			client_id: credentials.client._id,
			key: request.params.key
		}).then(function (data) {
			return reply({
				key: request.params.key,
				value: data ? data.value || '' : ''
			});
		}).onReject(function (error) {
			return reply(Boom.badImplementation(error), null, 'game-ctrl');
		});
		
	} else {
		
		GameData.find({
			game_id: credentials.game._id,
			client_id: credentials.client._id			
		}).then(function (dataArr) {
			var replyArr = [];
			dataArr.forEach(function (gamedata) {
				replyArr.push({
					key: gamedata.key,
					value: gamedata.value
				});
			});
			return reply(replyArr);
		}).onReject(function (error) {
			return reply(Boom.badImplementation(error), null, 'game-ctrl');
		});
		
	}
};


Ctrl.setData = function (request, reply) {
	return reply({});
};