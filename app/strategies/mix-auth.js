var UserModel = require('../models/user'),
	ClientModel = require('../models/client'),
	Wreck = require('wreck'),
	Boom = require('boom'),
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
		return callback(Boom.unauthorized('Missing identification'), false, credentials);
	}
	if (authData.udid && authData.udid != credentials.ident.udid) {
		// unauthorised guest (inconsistent signatures)
		return callback(null, false, credentials);
	}
	
	switch (method) {
		
		case 'basic':
			UserModel.findOneAndParse({ $or: [
					{ uname: authData.username},
					{ email: authData.username}
				]})
				.then(function (user) {
					credentials.user = user;
					return internals.confirmUserLoginAndPassword(credentials);
				})
				.then(internals.confirmUserClient)
				.then(internals.confirmClient)
				.then(function (credentials) {
					callback(null, true, credentials);
				})
				.onReject(function (error) {
					return callback(error, false, credentials);
				});

			
			break;

		 // todo: work in progress (find or create user first then update data from FB then callback)
		 // use wreck to call FB, good example -> https://github.com/yoitsro/hapi-access-token
		case 'oauth':
			if (authData.provider === 'facebook') {

				internals.confirmFBToken(credentials)
					.then(internals.confirmFBUser)
					.then(internals.confirmUserClient)
					.then(internals.confirmClient)
					.then(function (credentials) {
						callback(null, true, credentials);
					})
					.onReject(function (error) {
						callback(null, false, credentials);
						
						// todo: enable errors
						//callback(error, false, credentials);
					});
			} else {
				// no other providers supported yet
				callback(null, false, credentials);				
			}

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
	}
}

module.exports = {
	validateFunc : validateFunction
};

internals.confirmFBToken = function (credentials) {
	var promise = new Promise(),
		authData = credentials.auth.data,
		//profileUrl = 'https://graph.facebook.com/me?access_token=',
		profileUrl = 'https://graph.facebook.com/me' +
			'?fields=id,first_name,last_name,name,email,picture.type(large),gender,birthday,locale' +
			'&access_token=',
		requestOptions = {
			timeout: 10000,
			maxBytes: 1048576 // 1 mb - very generous!
		};

	Wreck.get(profileUrl + encodeURIComponent(authData.token), requestOptions, function(err, res, payload) {
		var payload = JSON.parse(payload);

		if (err) {
			promise.reject(error);
		}

		if (res.statusCode > 299) {
			promise.reject(payload.error);
		}

		credentials.social = payload;
		promise.fulfill(credentials);
	});
	return promise;
};

internals.confirmFBUser = function (credentials) {
	var promise = new Promise(),
		authData = credentials.auth.data,
		fbUser = credentials.social;

	UserModel.findOne({
		email: fbUser.email
	}).then(function (userData) {		
		var date = new Date(),
			user = new UserModel(userData ? userData : {});

		user.id = fbUser.id;
		user.email = fbUser.email;
		user.name = fbUser.name;
		user.fname = fbUser.first_name;
		user.lname = fbUser.last_name;
		user.created = user.created || date;
		user.updated = date;
		user.facebook = {
			token: authData.token,
			id: fbUser.id,
			link: fbUser.link
		};
		user.clients = user.clients || [];

		if (fbUser.locale) {
			user.locale = fbUser.locale.toLowerCase();
		}
		if (fbUser.gender) {
			user.gender = fbUser.gender;
		}
		if (fbUser.picture && fbUser.picture.data && fbUser.picture.data.url) {
			user.picture = fbUser.picture.data.url;
		}
		if (fbUser.birthday) {
			user.birthday = fbUser.birthday
		}
		
		user.save().then(function (user) {
			credentials.user = user;
			promise.fulfill(credentials);
		}).onReject(function (error) {
			promise.reject(error);
		});
	}, function (error) {
		return promise.reject(Boom.badImplementation(error));;
	});
	
	return promise;	
};

internals.confirmUserLoginAndPassword = function (credentials) {
	var promise = new Promise(),
		password = credentials.auth.data.password,
		hash = credentials.user.password;

	// verify password
	bcrypt.compare(password, hash, function (err, match) {
		if (match === false) {
			return promise.reject(Boom.unauthorized(err));
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
			credentials.user = user;
			promise.fulfill(credentials);
		}).onReject(function (error) {
			promise.reject(Boom.badImplementation(error));
		});
	} 	
	
	return promise;
};

internals.confirmClient = function (credentials) {
	var promise = new Promise(),
		ident = credentials.ident;
	
	ClientModel.forceFind({
		udid: ident.udid
	}).then(function (client) {
		credentials.client = client;
		promise.fulfill(credentials);
	}, function (error) {
		return promise.reject(Boom.badImplementation(error));
	});

	return promise;
};