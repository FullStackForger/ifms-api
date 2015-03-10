var Promise = require('mpromise'),
	Config = require('../config'),
	Ctrl = module.exports = {},
	internals = {};

Ctrl.getGameMeta = function (request, reply) {
	var game = request.auth.credentials.game,
		details = {
			title: game.title,
			updated: game.updated,
			version: game.version,
			description: game.description
		};
	
	reply(details);
};