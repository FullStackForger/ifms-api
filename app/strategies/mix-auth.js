var User = require('../models/user'),
	Client = require('../models/client'),
	bcrypt = require('bcrypt'),
	identParse = require('../helpers/ident').parse;


function validateFunction (method, authObject, callback) {
	var request = this,
		ident = identParse(request.headers.identificator);
	
	switch (method) {
		
		case 'basic':
			var query = { 
				$or: [
					{ uname: authObject.username},
					{ email: authObject.username}
				]};
			
			User.findOneAndParse(query).then(function(user) {
				user.client()
				bcrypt.compare(authObject.password, user.password, function (err, match) {
					callback(err, match, user);
				});
			}, function(error){
				callback(error, false, authObject);
			});
			
			break;

		case 'oauth':

			// todo: work in progress (find or create user first then update data from FB then callback)
			// use wreck to call FB, good example -> https://github.com/yoitsro/hapi-access-token
			callback(null, true, {});

			break;

		case 'guest':

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

module.exports = {
	validateFunc : validateFunction
};