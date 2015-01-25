var authorise = require('./authorise'),
	info = require('./info');

function authorisationHandler(request, reply) {
	//todo: check which authorisation strategy is used and redirect to the right method
	authorise.facebookAuthorisationHandler(request, reply);
}

function infoHandler(request, reply) {
	info.userDetailsHandler(request, reply);
}

module.exports = {
	authorisationHandler : authorisationHandler,
	infoHandler : infoHandler
}