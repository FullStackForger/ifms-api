var routes = [],
    handlerConfig,
	userCtrl = require('./controllers/user');

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
			handler: userCtrl.authorisationHandler
		}
	},{
		path: '/user',
		method: 'GET',
		config: {
			description: 'Provides registered user data',
			handler: userCtrl.detailsHandler
		}
	},{ 
		path: '/me', 
		method: 'GET', 
		config: handlerConfig 
	},{ 
		path: '/score', 
		method: 'GET, POST', 
		config: handlerConfig 
}];

module.exports = routes;