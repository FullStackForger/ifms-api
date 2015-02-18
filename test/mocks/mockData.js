var data = {},
	date = new Date(),
	oid = require('mongodb').ObjectID.createFromHexString;

data.userData = {
	_id: oid('54e50dd551631fc64f6c2fe9'),
	login: 'user',
	password: 'password', //password
	facebook: {
		token: 'fb-secret-hash'
	},
	updated: date,
	registered: date,
	clients: [{
		_id: oid('54e50dd551631fc64f6c2fea'),
		udid: 'aaabbbccc'
	}]
};

data.clientData = [{
	_id: oid("54e50dd551631fc64f6c2fea"),
	udid: 'aaabbbccc',
	updated: date,
	registered: date
}];

module.exports = data;