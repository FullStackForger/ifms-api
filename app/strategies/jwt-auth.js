var Client = require('../models/client'),
	UserModel = require('../models/user'),
	Game = require('../models/game'),
	Promise = require('mpromise'),
	identParse = require('../helpers/ident').parse,
	internals = {};

function validateFunc (token, callback) {
	var request = this,
		credentials = {
			token: token,
			ident: null,
			user: null,
			client: null
		};

	credentials.ident = identParse(request.headers.identification);
	if (!credentials.ident) {
		// unauthorised
		callback(null, false, credentials);
		return;
	}
	
	internals
		.confirmGame(credentials)
		.then(internals.confirmClientAndToken)
		.then(internals.lookupUser)
		.then(function(credentials) {
			callback(null, true, credentials);
		})
		.onReject(function (error) {
			callback(error, false, credentials);
		});
}

// schema: bearer-access-token
// https://github.com/johnbrett/hapi-auth-bearer-token
module.exports = {
	allowQueryToken: true,              // todo: set from config
	allowMultipleHeaders: false,
	accessTokenName: 'access_token',
	validateFunc : validateFunc
};

internals.confirmGame = function (credentials) {
	var promise = new Promise();
	
	Game.findOneAndParse({
		pkey: credentials.ident.pkey		
	}).then(function (game) {
		if (game == null) {
			return promise.reject(null);
		}

		credentials.game = game;
		promise.fulfill(credentials);
	}).onReject(function (error) {
		promise.reject(error);
	});
	return promise;
};

internals.confirmClientAndToken = function (credentials) {
	var promise = new Promise();

	Client.findOneAndParse({
		udid: credentials.ident.udid,
		games: { $elemMatch : {
			game_id: credentials.game._id,
			'token.signature': credentials.token
		}}
	}).then(function (client) {
		if (client == null) {
			return promise.reject(null);
		}
		
		credentials.client = client;
		promise.fulfill(credentials);
	}, function (error) {
		promise.reject(error);
	});

	return promise;
};

internals.lookupUser = function (credentials) {
	var promise = new Promise();
	if (credentials.client.user_id) {
		UserModel
			.findOneAndParse({_id: credentials.client.user_id})
			.then(function (user) {
				credentials.user = user;
				promise.fulfill(credentials);
			})
			.onReject(function (error) {
				promise.reject(error);
			});
	} else {
		process.nextTick(function() {
			promise.fulfill(credentials);
		});
	}
	return promise;
};