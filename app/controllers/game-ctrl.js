var Promise = require('mpromise'),
	Boom = require('boom'),
	User = require('../models/user'),
	Game = require('../models/game'),
	Config = require('../config'),
	JWS = require('jws'),
	secret = "environment_scpecific_secret", //todo: move to config
	Ctrl = module.exports = {},
	internals = {};

Ctrl.getData = function (request, reply) {
	reply(200);
};


Ctrl.setData = function (request, reply) {
	reply(200);
};