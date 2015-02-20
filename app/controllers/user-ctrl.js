var Promise = require('mpromise'),
	Boom = require('boom'),
	User = require('../models/user'),
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
			reply(Boom.badImplementation(error));
		});
};

Ctrl.getProfile = function(request, reply) {
	
	User.findOne(request.query)
		.then(function(data) {
			reply(data);
		})
		.onReject(function(error) {
			reply(Boom.badImplementation(error));
		});
};

internals.verifyGame = function (credentials) {
	var promise = new Promise();

	Game.findAndParse({
		pkey: credentials.ident.pkey
	}).then(function (game) {
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
		gameIndex;
	
	process.nextTick(function () {
		gameIndex = client.games.indexOf(credentials.ident.pkey);		
		
		if (!client.games) {
			client.games = [];
		}
		
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
		signature, token;
	
	signature = JWS.sign({
		header: { alg: Config.auth.algorithm },
		payload: credentials.client.udid,
		secret: Config.auth.secret
	});

	token = {
		signature: signature,
		expiry: Moment().add(60, 'minutes').toDate()
	};
	
	client.games.push({
		pkey: credentials.ident.pkey,
		title: credentials.game.title,
		token: token	
	});
	
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