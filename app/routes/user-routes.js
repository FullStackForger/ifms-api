var UsrCtrl = require('../controllers/user-ctrl'),
	UserRoutes = {};

UserRoutes.auth = {
	path: '/user/auth',
	method: ['GET', 'POST'],
	config: {
		auth: 'mix-auth',
		description: 'Authenticates user or client returning Access Token',
		handler: UsrCtrl.authorise
	}
};

UserRoutes.profileGET = {
	path: '/user/profile',
	method: 'GET',
	config: {
		auth: 'jwt-auth',
		description: "Returns user profile data object",
		handler: UsrCtrl.getProfile
	}
};

module.exports = UserRoutes;