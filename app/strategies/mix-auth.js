var User = require('../models/user'),
	Client = require('../models/client'),
	Promise = require('mpromise'),
	bcrypt = require('bcrypt'),
	identParse = require('../helpers/ident').parse,
	internals = {};


function validateFunction (method, authData, callback) {
	
	var request = this,		
		credentials = {
			auth: {
				method: method,
				data: authData
			},
			ident: null,
			user: null,
			client: null
		};
	
	credentials.ident = identParse(request.headers.identification);
	if (!credentials.ident) {
		// unauthorised
		return callback(null, false, credentials);
	}
	if (authData.udid && authData.udid != credentials.ident.udid) {
		// unauthorised guest (inconsistent signatures)
		return callback(null, false, credentials);
	}
	
	switch (method) {
		
		case 'basic':			
			
			User.findOneAndParse({ $or: [
					{ uname: authData.username},
					{ email: authData.username}
				]})
				.then(function (user) {
					credentials.user = user;
					return internals.confirmUser(credentials);
				})
				.then(internals.confirmUserClient)
				.then(internals.confirmClient)
				.then(function (credentials) {
					callback(null, true, credentials);
				})
				.onReject(function (error) {
					callback(error, false, credentials);
				});
			
			break;
		
		case 'oauth':

			// todo: work in progress (find or create user first then update data from FB then callback)
			// use wreck to call FB, good example -> https://github.com/yoitsro/hapi-access-token
			callback(null, true, {});

			break;

		case 'guest':

			internals
				.confirmClient(credentials)
				.then(function (credentials) {
					callback(null, true, credentials);
				})
				.onReject(function (error) {
					callback(error, false, credentials);
				});

			break;
		
		default:
			callback(null, false);
			break;
	}
}

module.exports = {
	validateFunc : validateFunction
};

internals.confirmUser = function(credentials) {
	var promise = new Promise(),
		password, hash;
		
	// extract hash and password
	try {
		password = credentials.auth.data.password;
		hash = credentials.user.password;
	} catch (exception) {
		promise.reject(exception);
	}
	
	// verify password
	bcrypt.compare(password, hash, function (err, match) {
		if (match === false) {
			promise.reject(err);
			return;
		}
		promise.fulfill(credentials);
	});

	return promise;
};

internals.confirmUserClient = function(credentials) {
	var promise = new Promise,
		user = credentials.user,
		ident = credentials.ident,
		confirmed = false;

	// enforce clients
	if (!user.clients || !Array.isArray(user.clients)) {
		user.clients = [];
	}

	// confirm UDID
	user.clients.forEach(function (udid) {
		if (udid === ident.udid) {
			confirmed = true;
		}
	});

	// register UDID
	if (confirmed) {
		promise.fulfill(credentials);
	} else {
		user.clients.push(ident.udid);
		user.save().then(function (user) {
			promise.fulfill(credentials);
		}).onReject(function (error) {
			promise.reject(error);
		});
	} 	
	
	return promise;
};

internals.confirmClient = function (credentials) {
	var promise = new Promise(),
		ident = credentials.ident;
	
	Client.forceFind({
		udid: ident.udid
	}).then(function (client) {
		credentials.client = client;
		promise.fulfill(credentials);
	}, function (error) {
		promise.reject(error);
	});

	return promise;
};