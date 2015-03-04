var routes = module.exports = {},
	statusConfig = {
		auth: false,
		description: "Returns user profile data object",
		handler: function(request, reply) {
			reply({
				status: "ok"
			});
		}
	};

routes.serviceStatus = {
	path: '/',
	method: 'GET',
	config: statusConfig
};

routes.serviceStatus = {
	path: '/service/status',
	method: 'GET',
	config: statusConfig
};