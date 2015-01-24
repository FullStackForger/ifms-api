var Boom = require('boom'),
	Crypto = require('crypto'),
	Hoek = require('hoek'),
	Wreck = require('wreck'),
	Querystring = require('querystring'),
	Config = require('../../config');

function basicAuthorisationHandler(request, reply) {

}

function facebookAuthorisationHandler(request, reply) {
	var getOptions,
		appSecretProof,
		query = {},
		url = 'https://graph.facebook.com/me',
		auth = Hoek.clone(request.auth);
	
	if (auth.isAuthenticated !== true) {
		// todo: write test for failed authentication, eg.: change
	}
		

	// todo: check by email if user is registerd and authorise BG API if yes

	// todo: if user is not registered obtain token_for_business

	appSecretProof = Crypto
		.createHmac('sha256', Config.facebook.clientSecret)
		.update(request.auth.credentials.token)
		.digest('hex');

	query = {
		appsecret_proof: appSecretProof,
		fields: 'token_for_business'
	};

	getOptions = {
		headers: {
			Authorization: 'Bearer ' + request.auth.credentials.token
		},
		json: true
	};

	url += '?' + Querystring.encode(query);

	Wreck.get(url, getOptions, function (err, res, payload) {

		if (err || res.statusCode !== 200) {
			return reply(Boom.internal('Failed obtaining ' + name + ' user profile', err || payload));
		}

		// todo: findout why payload is string and not JSON (it has been requested in getOptions)
		auth.credentials.token_for_business = JSON.parse(payload).token_for_business;

		reply('<pre>' + JSON.stringify(auth, null, 4) + '</pre>');
	});

}

module.exports = {
	facebookAuthorisationHandler : facebookAuthorisationHandler
};