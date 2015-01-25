var routes = [],
    handlerConfig,
	userController = require('./controllers/user');

handlerConfig = {
    description: 'test config for new endpoints',
    handler: function handleOK(response, reply) {
        reply('end-point created but doesn\'t have code yet');
    }
};

routes = [{
		path: '/',
		method: 'GET',
		config: handlerConfig
	},{
		path: '/auth',
		method: 'GET',
		config: {
			auth: 'facebook',
			description: 'Authorises user via authentication and/or registration',
			handler: userController.authorisationHandler
		}
	},{
		path: '/user',
		method: 'GET',
		config: {
			description: 'Provides registered user data',
			handler: userController.infoHandler
		}
	},{ 
		path: '/user/register',
		method: 'GET', 
		config: handlerConfig 
	},{ 
		path: '/score', 
		method: 'GET, POST', 
		config: handlerConfig 
}];

module.exports = routes;