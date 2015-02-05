function validateFunction (method, authObject, callback) {
	return callback(null, false);
	/**
	 switch (method) {
		case 'basic':
			Bcrypt.compare(authObject.password, user.password, function (err, isValid) {
				callback(err, isValid, { id: user.id, name: user.name });
			});
			break;
		case 'oauth':
			if (authObject.token === user.token) {
				callback(null, true, { id: user.id, name: user.name });
			}
			break;
		case 'guest':
			if (authObject.udid) {
				callback(null, true, { guest: true, udid: authObject.udid });
			}
			break;
		default:
			return callback(null, false);
			break;
	}
	 **/
};

// hapi-app-mix-auth strategy for oath, basic and guest authentication
module.exports = {
	validateFunc : validateFunction
};