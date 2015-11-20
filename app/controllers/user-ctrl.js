var Promise = require('mpromise'),
	Boom = require('boom'),
	Game = require('../models/game'),
	Config = require('../config'),
	JWS = require('jws'),
	Moment = require('moment'),
	secret = "environment_scpecific_secret", //todo: move to config
	Ctrl = module.exports = {},
	internals = {};

Ctrl.authorise = function (request, reply) {
	
	var credentials = request.auth.credentials;

	credentials.client.agent = request.headers["user-agent"];
	credentials.client.updated = new Date();

	internals.verifyGame(credentials)
		.then(internals.verifyClientGame)
		.then(internals.generateToken)
		.then(function (credentials) {
			request.auth.credentials = credentials;
			reply(credentials.token);
		})
		.onReject(function (error) {
			if (typeof error === 'string') {
				return reply(Boom.unauthorized(error), false, credentials);
			}
			reply(Boom.badImplementation(error));
		});
};

Ctrl.getProfile = function(request, reply) {
	var client = request.auth.credentials.client;
	reply({
		uname: client.uname,
		type: client.user_id ? 'registered' : 'guest'
	});
};

internals.verifyGame = function (credentials) {
	var promise = new Promise();

	Game.findOneAndParse({
		pkey: credentials.ident.pkey
	}).then(function (game) {
		if (!game) {
			promise.reject("Invalid game public key");
		}
		credentials.game = game;
		promise.fulfill(credentials);
	}, function (error) {
		promise.reject(error);
	});

	return promise;
};

internals.verifyClientGame = function (credentials) {
	var client = credentials.client,
		promise = new Promise(),
		gameIndex = -1;
	
	process.nextTick(function () {
		var i = 0, game;

		if (!client.games) {
			client.games = [];
		}

		// check if game exist
		while (i < client.games.length && gameIndex === -1) {
			game = client.games[i];
			if (game.game_id === credentials.game._id) {
				gameIndex = i;
			}
			i++;
		}

		// remove from the list if found
		if (gameIndex > -1) {
			client.games.splice(gameIndex, 1);
		}
		promise.fulfill(credentials);
	});
	
	return promise;
};

internals.generateToken = function (credentials) {
	var promise = new Promise(),
		client = credentials.client,
		signature, expiry, token, game;

	expiry = Moment().add(60, 'minutes').toDate();
	
	signature = JWS.sign({
		header: { alg: Config.auth.algorithm },
		payload: credentials.client.udid + ':' + expiry.getTime(),
		secret: Config.auth.secret
	});

	token = {
		signature: signature,
		expiry: expiry
	};

	game = {
		game_id: credentials.game._id,
		title: credentials.game.title,
		token: token
	};

	client.addOrUpdateGame(game);
	
	client
		.save()
		.then(function (client) {
			credentials.client = client;
			credentials.token = token;
			promise.fulfill(credentials);
		})
		.onReject(function (error) {
			promise.reject(error)
		});
	
	return promise;
};