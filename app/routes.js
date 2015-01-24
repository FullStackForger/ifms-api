var routes = [],
    handlerConfig,
	userCtrl = require('./controllers/user/authorise.js');

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
		path: '/me', 
		method: 'GET', 
		config: handlerConfig 
	},{ 
		path: '/score', 
		method: 'GET, POST', 
		config: handlerConfig 
}];

module.exports = routes;