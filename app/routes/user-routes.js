var UsrCtrl = require('../controllers/user-ctrl'),
	UserRoutes = [];

UserRoutes.push({
	path: '/user/auth',
	method: ['GET', 'POST'],
	config: {
		auth: 'mix-auth',
		description: 'Authenticates user or client returning Access Token',
		handler: UsrCtrl.authorise
	}
});

UserRoutes.push({
	path: '/user/profile',
	method: 'GET',
	config: {
		description: "Returns user profile data object",
		handler: UsrCtrl.getProfile
	}
});

module.exports = UserRoutes;