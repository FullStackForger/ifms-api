var authorise = require('./authorise'),
	details = require('./details');

function authorisationHandler(request, reply) {
	//todo: check which authorisation strategy is used and redirect to the right method
	authorise.facebookAuthorisationHandler(request, reply);
}

function detailsHandler(request, reply) {
	details.userDetailsHandler(request, reply);
}

module.exports = {
	authorisationHandler : authorisationHandler,
	detailsHandler : detailsHandler
}