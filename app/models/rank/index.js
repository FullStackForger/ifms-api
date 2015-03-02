// note: this is an abstract model layer built over game Score model

var RankModel = module.exports = {},
	Hoek = require('hoek'),
	Model = require('hapi-app-mongo-model'),
	ScoreModel = require('../score'),
	Promise = require('mpromise'),
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

	query = Hoek.merge(internals.getScopeFindQuery(queryData.scope), baseQuery);

	// find data by key
	ScoreModel.findOneAndParse(query).then(function (gameData) {
		var rankQuery;

		replyData.scope = queryData.scope;
		replyData.score = internals.getResultScore(queryData.scope, gameData);

		rankQuery = internals.getScopeRankQuery(queryData.scope, replyData.score);
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
		baseQuery, query;

	process.nextTick(function(){
		promise.fulfill({});
	});
	
	return promise;
	/*
	baseQuery = {
		game_id: credentials.game._id,
		client_id: credentials.client._id
	};

	// find data by the key before aggregating
	query = Hoek.merge(internals.getScopeFindQuery(scope), baseQuery);
	ScoreModel.findOneAndParse(query).then(function (gameData) {
		var collectionName = ScoreModel.config.collection,
			scopeScore = internals.getResultScore(scope, gameData),
			summaryQuery = [];

		// todo 1: update current user score to 0 if needed

		// todo 2: move to promises

		// todo 3: move aggregate to static model methods

		summaryQuery.push({
			$match: { $and : [
				{ game_id: credentials.game._id },
				// todo: that should be done for different keys
				internals.getScopeRankQuery(scope, scopeScore)
			]}
		});

		summaryQuery.push({
			$group: {
				_id: "$key",
				low: { $min: "$" + internals.getScopedField(scope) },
				high: { $max: "$" + internals.getScopedField(scope) },
				rank: { $sum: 1 }
			}
		});

		summaryQuery.push({
			$sort: {
				_id: 1
			}
		});

		Model.db.driver._native.collection(collectionName, function (error, collection) {
			if (error) {
				return promise.reject(error);
			}

			collection.aggregate(summaryQuery, function (error, resultData) {
				if (error) {
					return promise.reject(error);
				}
				promise.fulfill(resultData);
			});
		});

	}).onReject(function (error) {
		promise.reject(error);
	});

	return promise;
	*/
};


internals.getScopedField = function (scope) {
	switch (scope) {
		case 'daily':
			return'ds';
			break;
		case 'weekly':
			return'ds';
		case 'monthly':
			return 'ms';
			break;
		case 'best':
		default:
			return 'bos';
			break;
	}
};

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
			rankQuery.ds = { $gte: score };
			rankQuery.dd = internals.startOfToday;
			break;
		case 'weekly':
			rankQuery.ws = { $gte: score };
			rankQuery.wd = internals.startOfTheWeek;
			break;
		case 'monthly':
			rankQuery.ms = { $gte: score };
			rankQuery.md = internals.startOfTheMonth;
			break;
		case 'best':
		default:
			rankQuery.bos = { $gte: score };
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
};
/* example aggregate
db.game_scores.aggregate([
	{
		$match: {
			$and: [
				{
					game_id: ObjectId("3e5eeeeeeeeeeeeeeeeeeee1")
				},
				{
					bos: {
						$gte: 0
					}
				}
			]
		}
	},
	{
		$group: {
			_id: "$key",
			leader: {
				$max: "$bos"
			},
			rank: {
				$sum: 1
			}
		}
	},
	{
		$sort: {
			value: 1
		}

	}
])
 */