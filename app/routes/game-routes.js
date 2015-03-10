var GameDataCtrl = require('../controllers/game-data-ctrl'),
	GameMetaCtrl = require('../controllers/game-meta-ctrl'),
	GameScoreCtrl = require('../controllers/game-score-ctrl'),
	GameScoreRankCtrl = require('../controllers/game-rank-ctrl'),
	GameRoutes = module.exports = {};

GameRoutes.dataGET = {
	path: '/game/data/{key?}',
	method: ['GET'],
	config: {
		auth: 'jwt-auth',
		description: 'Authenticates user or client returning Access Token',
		handler: GameDataCtrl.getData
	}
};

GameRoutes.dataPOST = {
	path: '/game/data',
	method: ['POST'],
	config: {
		auth: 'jwt-auth',
		description: 'Authenticates user or client returning Access Token',
		handler: GameDataCtrl.saveData
	}
};

GameRoutes.rankGET = {
	path: '/game/rank/{scope}/{key?}',
	method: ['GET'],
	config: {
		auth: 'jwt-auth',
		description: 'Retrieves game score rank for an authorised user',
		handler: GameScoreRankCtrl.getRank
	}
};

GameRoutes.scoreGET = {
	path: '/game/score/{key?}',
	method: ['GET'],
	config: {
		auth: 'jwt-auth',
		description: 'Retrieves game single score or all scores for an authorised user',
		handler: GameScoreCtrl.getScore
	}
};

GameRoutes.scorePOST = {
	path: '/game/score',
	method: ['POST'],
	config: {
		auth: 'jwt-auth',
		description: 'Saves game single score of an authorised user',
		handler: GameScoreCtrl.saveScore
	}
};

GameRoutes.metaGET = {
	path: '/game/meta',
	method: ['GET'],
	config: {
		auth: 'jwt-auth',
		description: 'Retrieves game details',
		handler: GameMetaCtrl.getGameMeta
	}
};