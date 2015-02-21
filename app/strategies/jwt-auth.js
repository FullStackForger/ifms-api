var Client = require('../models/client'),
	Promise = require('mpromise'),
	identParse = require('../helpers/ident').parse,
	internals = {};

function validateFunc (token, callback) {
	var request = this,
		credentials = {
			token: token,
			ident: null,
			user: null,
			client: null
		};

	credentials.ident = identParse(request.headers.identification);
	if (!credentials.ident) {
		// unauthorised
		callback(null, false, credentials);
		return;
	}
	
	internals
		.confirmClientAndToken(credentials)
		.then(function(credentials) {
			callback(null, true, credentials);
		})
		.onReject(function (error) {
			callback(null, false, credentials);
		});
}

// schema: bearer-access-token
// https://github.com/johnbrett/hapi-auth-bearer-token
module.exports = {
	allowQueryToken: true,              // todo: set from config
	allowMultipleHeaders: false,
	accessTokenName: 'access_token',
	validateFunc : validateFunc
};

internals.confirmClientAndToken = function (credentials) {
	var promise = new Promise();

	Client.findOneAndParse({
		udid: credentials.ident.udid,
		games: { $elemMatch : {
			pkey: credentials.ident.pkey,
			'token.signature': credentials.token
		}}
	}).then(function (client) {
		credentials.client = client;
		
		if (client == null) {
			promise.reject(credentials);
			return;			
		}
		
		promise.fulfill(credentials);
	}, function (error) {
		promise.reject(error);
	});

	return promise;
};