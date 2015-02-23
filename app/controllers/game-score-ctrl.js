var Moment = require('moment'),
	Promise = require('mpromise'),
	Boom = require('boom'),
	GameScore = require('../models/game-score'),
	Config = require('../config'),
	secret = "environment_scpecific_secret", //todo: move to config
	Ctrl = module.exports = {},
	internals = {};

Ctrl.getScore = function (request, reply) {
	var credentials = request.auth.credentials;

	if (request.params.key) {

		// find data by key
		GameScore.findOneAndParse({
			game_id: credentials.game._id,
			client_id: credentials.client._id,
			key: request.params.key
		}).then(function (data) {
			// check and update dates if needed
			return reply(internals.parseScoreToReply(request.params.key, data));
		}).onReject(function (error) {
			return reply(Boom.badImplementation(error), null, 'game-score-ctrl');
		});
		
	} else {

		// find all data
		GameScore.find({
			game_id: credentials.game._id,
			client_id: credentials.client._id			
		}).then(function (dataArr) {
			var replyArr = [];
			dataArr.forEach(function (data) {
				replyArr.push(internals.parseScoreToReply(data.key, data));
			});
			return reply(replyArr);
		}).onReject(function (error) {
			return reply(Boom.badImplementation(error), null, 'game-score-ctrl');
		});
		
	}
};


Ctrl.saveScore = function (request, reply) {
	var credentials = request.auth.credentials;
	
	if (!request.payload.key || !request.payload.value) {
		return reply(Boom.badRequest('invalid query'), request.payload);
	}
	
	GameScore.findOneAndParse({
		game_id: credentials.game._id,
		client_id: credentials.client._id,
		key: request.payload.key
	}).then(function (data) {
		var value = request.payload.value;
		if (!data) {
			data = new GameScore({
				game_id: credentials.game._id,
				client_id: credentials.client._id,
				key: request.payload.key,
				ds: value,
				dd: internals.startOfToday,
				ws: value,
				wd: internals.startOfTheWeek,
				ms: value,
				md: internals.startOfTheMonth,
				bos: value
			});
		}
		
		data = internals.parseScoreToStore(value, data);
		
		data.save().then(function (result) {
			reply({
				success: true,
				data: internals.parseScoreToReply(result.key, result)
			});			
		}).onReject(function (error) {
			return reply(Boom.badImplementation(error), null, 'game-score-ctrl');
		});

	}).onReject(function (error) {
		return reply(Boom.badImplementation(error), null, 'game-score-ctrl');
	});

};

internals.startOfToday = parseInt(Moment().startOf('day').format('YYMMDD'));
internals.startOfTheWeek = parseInt(Moment().startOf('week').subtract(6, 'days').format('YYMMDD'));
internals.startOfTheMonth = parseInt(Moment().startOf('month').format('YYMMDD'));
internals.parseScoreToReply = function (key, data) {
	return {
		key: key,
		daily: data && data.ds && data.dd === internals.startOfToday ? data.ds : 0,
		weekly: data && data.ws && data.wd === internals.startOfTheWeek ? data.ws : 0,
		monthly: data && data.ms && data.md === internals.startOfTheMonth ? data.ms : 0,
		best: data && data.bos ? data.bos : 0
	}
};
internals.parseScoreToStore = function (value, data) {
	
	if (data.bos < value) {
		
		data.bos = value;
		
		data.ms = value;
		data.md = internals.startOfTheMonth;
		
		data.ws = value;
		data.wd = internals.startOfTheWeek;
		
		data.ds = value;
		data.dd = internals.startOfToday;
		
		return data;
	} 
	
	if (data.md != internals.startOfTheMonth) {
		
		data.ms = value;
		data.md = internals.startOfTheMonth
		
	} else if (data.ms < value) {

		data.ms = value;
		data.md = internals.startOfTheMonth;

		data.ws = value;
		data.wd = internals.startOfTheWeek;

		data.ds = value;
		data.dd = internals.startOfToday;
		
		return data;
	}

	if (data.wd != internals.startOfTheWeek) {

		data.ws = value;
		data.wd = internals.startOfTheWeek;

	} else if (data.ws < value) {

		data.ws = value;
		data.wd = internals.startOfTheWeek;

		data.ds = value;
		data.dd = internals.startOfToday;

		return data;
	}

	if (data.dd != internals.startOfToday) {

		data.ds = value;
		data.dd = internals.startOfToday;

	} else if (data.ds < value) {

		data.ds = value;
		data.dd = internals.startOfToday;

		return data;
	}

	return data;
};