var Promise = require('mpromise'),
	Boom = require('boom'),
	User = require('../models/user'),
	Game = require('../models/game'),
	GameScore = require('../models/game-score'),
	Config = require('../config'),
	JWS = require('jws'),
	secret = "environment_scpecific_secret", //todo: move to config
	Ctrl = module.exports = {},
	internals = {};

Ctrl.getScore = function (request, reply) {
	var credentials = request.auth.credentials;

	if (request.params.key) {

		GameScore.findOneAndParse({
			game_id: credentials.game._id,
			client_id: credentials.client._id,
			key: request.params.key
		}).then(function (data) {
			return reply({
				key: request.params.key,
				daily: data ? data.ds : 0 || 0,
				weekly: data ? data.ws : 0 || 0,
				monthly: data ? data.ms : 0 || 0,
				best: data ? data.bos : 0 || 0
			});
		}).onReject(function (error) {
			return reply(Boom.badImplementation(error), null, 'game-score-ctrl');
		});
		
	} else {

		GameScore.find({
			game_id: credentials.game._id,
			client_id: credentials.client._id			
		}).then(function (dataArr) {
			var replyArr = [];
			dataArr.forEach(function (data) {
				replyArr.push({
					key: data.key,
					daily: data ? data.ds : 0 || 0,
					weekly: data ? data.ws : 0 || 0,
					monthly: data ? data.ms : 0 || 0,
					best: data ? data.bos : 0 || 0
				});
			});
			return reply(replyArr);
		}).onReject(function (error) {
			return reply(Boom.badImplementation(error), null, 'game-score-ctrl');
		});
		
	}
};


Ctrl.saveScore = function (request, reply) {
	reply(Boom.badImplementation('in progress'));
};