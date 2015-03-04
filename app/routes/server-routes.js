module.exports = {
	statusRoute : {
		path: '/server/status',
		method: 'GET',
		config: {
			auth: false,
			description: "Returns user profile data object",
			handler: function(request, reply) {
				reply({
					question: "Are we an effective team?",
					response: "We are an effective team!"
				});
			}
		}
	}
};