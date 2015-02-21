var GameCtrl = require('../controllers/game-ctrl'),
	GameRoutes = {};

GameRoutes.dataGET = {
	path: '/user/data',
	method: ['GET'],
	config: {
		auth: 'jwt-auth',
		description: 'Authenticates user or client returning Access Token',
		handler: GameCtrl.getData
	}
};

GameRoutes.dataPOST = {
	path: '/user/data',
	method: ['POST'],
	config: {
		auth: 'jwt-auth',
		description: 'Authenticates user or client returning Access Token',
		handler: GameCtrl.setData
	}
};

module.exports = GameRoutes;