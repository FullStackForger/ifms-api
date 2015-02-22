var GameDataCtrl = require('../controllers/game-data-ctrl'),
	GameScoreCtrl = require('../controllers/game-score-ctrl'),
	GameRoutes = {};

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
	path: '/game/data/{key}',
	method: ['POST'],
	config: {
		auth: 'jwt-auth',
		description: 'Authenticates user or client returning Access Token',
		handler: GameDataCtrl.saveData
	}
};


GameRoutes.scoreGET = {
	path: '/game/score/{key?}',
	method: ['GET'],
	config: {
		auth: 'jwt-auth',
		description: 'Authenticates user or client returning Access Token',
		handler: GameScoreCtrl.getScore
	}
};

GameRoutes.scorePOST = {
	path: '/game/score/',
	method: ['POST'],
	config: {
		auth: 'jwt-auth',
		description: 'Authenticates user or client returning Access Token',
		handler: GameScoreCtrl.saveScore
	}
};
module.exports = GameRoutes;