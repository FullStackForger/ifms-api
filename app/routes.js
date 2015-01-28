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
		path: '/auth',  //todo: authenticates and/or registers (internal redirection) and sends back game token
		method: 'GET',
		config: {
			auth: 'facebook',
			description: 'Authorises user via authentication and/or registration',
			handler: userController.authorisationHandler
		}
	},{
		path: '/user',  //todo: sends back user data retrieved from database
		method: 'GET',
		config: {
			description: 'Provides registered user data',
			handler: userController.infoHandler
		}
	},{ 
		path: '/user/register', //todo: registers user with provided data (facebook, anonymous, login+pass)
		method: 'GET', 
		config: handlerConfig 
	},{
		path: '/game/{id}', //todo: retrieves game info (namve,description, version) for registered with latest news
		method: 'GET',
		config: handlerConfig
	},{
		path: '/game/{id}/meta', //todo: retrieves game metadata (score keys & achievenents) for registered
		method: 'GET',
		config: handlerConfig
	},{
		path: '/game/{id}/score/{key}', //todo: saves and loads game score by defined id
		method: 'GET, POST',
		config: handlerConfig
	},{
		path: '/game/{id}/all', //todo: retrieves all or saves bulk scores, payload: array of pairs: key, score
		method: 'GET, POST',
		config: handlerConfig
}];

module.exports = routes;