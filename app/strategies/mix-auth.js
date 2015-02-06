var User = require('../models/user'),
	Client = require('../models/client');


function validateFunction (method, authObject, callback) {
	switch (method) {
		
		case 'basic':

			User.findOne({
				uname: authObject.login,
				email: authObject.login,
				password: authObject.password
			}).then(function(user) {
				callback(null, true, user);
			}, function(error){
				callback(error, false, authObject);
			});
			
			break;

		case 'oauth':

			// todo: work in progress (find or create user first then update data from FB then callback)
			// use wreck to call FB, good example -> https://github.com/yoitsro/hapi-access-token
			callback(null, true, credentials);

			break;

		case 'guest':

			//todo: replace findOne() with findOrInsertOne
			Client.findOne({
				udid: authObject.udid
			}).then(function(client) {
				if (!client) {
					Client.insert({
						udid: authObject.udid						
					}).then(function(client) {
						callback(null, true, client);
					}).onReject(function(error) {
						callback(error, false, client);
					})
				} else {
					callback(null, true, client);
				} 

			}, function(error) {
				callback(error, false, authObject);
			});
			
			break;
		
		default:
			callback(null, false);
			break;
	}
}

// hapi-app-mix-auth strategy for oath, basic and guest authentication
module.exports = {
	validateFunc : validateFunction
};