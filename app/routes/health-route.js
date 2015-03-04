module.exports = {
	statusRoute : {
		path: '/user/profile',
		method: 'GET',
		config: {
			auth: 'jwt-auth',
			description: "Returns user profile data object",
			handler: function(request, reply) {
				reply("We are an effective team!")
			}
		}
	}
};