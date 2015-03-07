var UsrCtrl = require('../controllers/user-ctrl'),
	UserRoutes = module.exports = {};

UserRoutes.auth = {
	path: '/user/auth',
	method: ['GET'],
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