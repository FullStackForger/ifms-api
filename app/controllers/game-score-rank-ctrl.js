var Hoek = require('hoek'),
	Moment = require('moment'),
	Promise = require('mpromise'),
	Boom = require('boom'),
	GameScore = require('../models/game-score'),
	Config = require('../config'),
	secret = "environment_scpecific_secret", //todo: move to config
	Ctrl = module.exports = {},
	internals = {};

Ctrl.getScoreRank = function (request, reply) {
	var allowedScopes = ['daily', 'weekly', 'monthly', 'best'],
		credentials = request.auth.credentials,		
		scope = 'best', 
		baseQuery, query, replyData = {};

	if (request.params.scope) {
		scope = request.params.scope;
	}
	
	if (allowedScopes.indexOf(scope) === -1) {
		return reply(Boom.badRequest('invalid query'), request.params)
	}

	baseQuery = {
		game_id: credentials.game._id,
		client_id: credentials.client._id,
		key: request.params.key
	};
			
	query = Hoek.merge(internals.getScopeFindQuery(scope), baseQuery);
	
	// find data by key
	GameScore.findOneAndParse(query).then(function (gameData) {
		var rankQuery;
		
		replyData.scope = scope;
		replyData.score = internals.getResultScore(scope, gameData);
		
		rankQuery = internals.getScopeRankQuery(scope, replyData.score);
		rankQuery.game_id = credentials.game._id;
		rankQuery.key = request.params.key;
		
		GameScore.count(rankQuery).then(function (resultData) {
			
			replyData.rank = resultData;
			reply(replyData);
			
		}).onReject(function (error) {
			return reply(Boom.badImplementation(error), null, 'game-score-ctrl');
		});

	}).onReject(function (error) {
		return reply(Boom.badImplementation(error), null, 'game-score-ctrl');
	});
	
};

internals.startOfToday = parseInt(Moment().startOf('day').format('YYMMDD'));
internals.startOfTheWeek = parseInt(Moment().startOf('week').format('YYMMDD'));
internals.startOfTheMonth = parseInt(Moment().startOf('month').format('YYMMDD'));

internals.getScopeFindQuery = function (scope) {
	var scopeQuery = {};
	
	switch (scope) {
		case 'daily':
			scopeQuery.dd = internals.startOfToday;
			break;
		case 'weekly':
			scopeQuery.wd = internals.startOfTheWeek;
			break;
		case 'monthly':
			scopeQuery.md = internals.startOfTheMonth;
			break;
		case 'best':
		default:
			// no query required
			break;
	}

	return scopeQuery;
};

internals.getScopeRankQuery = function (scope, score) {
	var rankQuery = {};

	switch (scope) {
		case 'daily':
			rankQuery.ds = { $gt: score };
			rankQuery.dd = internals.startOfToday;			
			break;
		case 'weekly':
			rankQuery.ws = { $gt: score };
			rankQuery.wd = internals.startOfTheWeek;
			break;
		case 'monthly':
			rankQuery.ms = { $gt: score };
			rankQuery.md = internals.startOfTheMonth;
			break;
		case 'best':
		default:
			rankQuery.bos = { $gt: score };
			break;
	}

	return rankQuery;
};

internals.getResultScore = function (scope, gameData) {
	var score;
	
	if (gameData == null) {
		return 0;
	}
	
	switch (scope) {
		case 'daily':
			score = gameData.ds || 0;
			break;
		case 'weekly':
			score = gameData.ws || 0;
			break;
		case 'monthly':
			score = gameData.ms || 0;
			break;
		case 'best':
		default:
			score = gameData.bos || 0;
			break;
	}

	return score;
}