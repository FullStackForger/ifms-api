var Promise = require('mpromise'),
	Boom = require('boom'),
	Config = require('../config'),
	secret = "environment_scpecific_secret", //todo: move to config
	Ctrl = module.exports = {},
	RankHelper = require('../models/rank');
	internals = {};

Ctrl.getRank = function (request, reply) {
	var allowedScopes = ['daily', 'weekly', 'monthly', 'best'],
		scope = request.params.scope,
		credentials = request.auth.credentials,
		rankQueryData;

	if (allowedScopes.indexOf(scope) === -1) {
		return reply(Boom.badRequest('invalid query'), request.params)
	}


	rankQueryData = {
		game_id: credentials.game._id,
		client_id: credentials.client._id,
		scope: scope		
	};
	
	if (request.params.key) {

		rankQueryData.key = request.params.key;
		RankHelper.getOneRank(rankQueryData).then(function (data) {
			reply(data);
		}).onReject(function (error) {
			return reply(Boom.badImplementation(error), null, 'game-score-ctrl');
		});
		
	} else {
		
		RankHelper.getRankSummary(rankQueryData).then(function (data) {
			reply(data);
		}).onReject(function (error) {
			return reply(Boom.badImplementation(error), null, 'game-score-ctrl');
		});		
	}
};