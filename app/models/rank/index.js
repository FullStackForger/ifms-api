// note: this is an abstract model layer built over game Score model

var RankModel = module.exports = {},
	Hoek = require('hoek'),
	Model = require('hapi-app-mongo-model'),
	ScoreModel = require('../score'),
	Promise = require('mpromise'),
	DateHelper = require('../../helpers/date'),
	internals = {};


/**
 * @param {String} queryData.client_id
 * @param {String} queryData.game_id
 * @param {String} queryData.scope
 * @param {String} queryData.key
 * @param {Object} queryData
 * @returns {Promise}
 */
RankModel.getOneRank = function (queryData) {
	var promise = new Promise(),
		baseQuery, query, replyData = {};

	baseQuery = {
		game_id: queryData.game_id,
		client_id: queryData.client_id,
		key: queryData.key
	};

	query = Hoek.merge(internals.getScopedFindQuery(queryData.scope), baseQuery);

	// find data by key
	ScoreModel.findOneAndParse(query).then(function (gameData) {
		var rankQuery;

		replyData.score = internals.getScopedScore(queryData.scope, gameData);

		rankQuery = internals.getScopedRankQuery(queryData.scope, replyData.score);
		rankQuery.game_id = queryData.game_id;
		rankQuery.key = queryData.key;

		ScoreModel.count(rankQuery).then(function (resultData) {

			replyData.rank = resultData;
			promise.fulfill(replyData);

		}).onReject(function (error) {
			promise.reject(error);
		});

	}).onReject(function (error) {
		promise.reject(error);
	});

	return promise;
};

/**
 * @param {String} queryData.client_id
 * @param {String} queryData.game_id
 * @param {String} queryData.scope
 * @param {Object} queryData
 * @returns {Promise}
 */
RankModel.getRankSummary = function (queryData) {
	var scope = queryData.scope,
		promise = new Promise(),
		collectionName = ScoreModel.config.collection,
		clientScoreQuery = {
			game_id: queryData.game_id,
			client_id: queryData.client_id
		};

	// find data by the key before aggregating
	clientScoreQuery = Hoek.merge(internals.getScopedFindQuery(scope), clientScoreQuery);
	ScoreModel.find(clientScoreQuery).then(function (scores) {
		var scopeScores = [],
			savedScoreData = {},
			summaryQueryPipeline;

		// build scoped scores matrix
		scores.forEach(function(scoreData) {
			var score = internals.getScopedScore(scope, scoreData),
				query = internals.getScopedRankQuery(scope, score);
				query.key = scoreData.key;
			
			// save user data for later merge with aggregated results
			savedScoreData[scoreData.key] = score;
			scopeScores.push(query);
		});

		// build aggregation pipeline
		summaryQueryPipeline = [
			{
				$match: { $and : [
					{ game_id: queryData.game_id },
					{ $or: scopeScores }
				]}
			},
			{
				$group: {
					_id: "$key",
					leader: { $max: "$" + internals.getScopedField(scope) },
					rank: { $sum: 1 }
				}
			},{
				$sort: {
					_id: 1
				}
			}
		];

		// use mongodb driver, hapi-app-mongo-model (monk, mongoskin) doesn't support aggregation
		Model.db.driver._native.collection(collectionName, function (error, scoreCollection) {
			if (error) {
				return promise.reject(error);
			}
			
			scoreCollection.aggregate(summaryQueryPipeline, function (error, resultData) {
				var  finalResult = [];
				
				if (error) {
					return promise.reject(error);
				}

				// combine data
				resultData.forEach(function(data) {
					data.score = savedScoreData[data._id];
					data.key = data._id;
					delete data._id;
					finalResult.push(data);
				});
				
				promise.fulfill(finalResult);
			});
		});

	}).onReject(function (error) {
		promise.reject(error);
	});

	return promise;
};


internals.getScopedField = function (scope) {
	switch (scope) {
		case 'daily':
			return'ds';
			break;
		case 'weekly':
			return'ws';
		case 'monthly':
			return 'ms';
			break;
		case 'best':
		default:
			return 'bos';
			break;
	}
};

internals.getScopedFindQuery = function (scope) {
	var scopeQuery = {};

	switch (scope) {
		case 'daily':
			scopeQuery.dd = DateHelper.startOfToday;
			break;
		case 'weekly':
			scopeQuery.wd = DateHelper.startOfTheWeek;
			break;
		case 'monthly':
			scopeQuery.md = DateHelper.startOfTheMonth;
			break;
		case 'best':
		default:
			// no query required
			break;
	}

	return scopeQuery;
};

internals.getScopedRankQuery = function (scope, score) {
	var rankQuery = {};

	switch (scope) {
		case 'daily':
			rankQuery.ds = { $gte: score };
			rankQuery.dd = DateHelper.startOfToday;
			break;
		case 'weekly':
			rankQuery.ws = { $gte: score };
			rankQuery.wd = DateHelper.startOfTheWeek;
			break;
		case 'monthly':
			rankQuery.ms = { $gte: score };
			rankQuery.md = DateHelper.startOfTheMonth;
			break;
		case 'best':
		default:
			rankQuery.bos = { $gte: score };
			break;
	}

	return rankQuery;
};

internals.getScopedScore = function (scope, gameData) {
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
};