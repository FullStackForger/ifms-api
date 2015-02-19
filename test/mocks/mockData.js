var data = {},
	date = new Date(),
	oid = require('mongodb').ObjectID.createFromHexString,
	bcrypt = require('bcrypt');

data.users = [];
data.users.push({
	_id: oid('54e50dd551631fc64f6c2fe9'),
	uname: 'KillerMachine',
	fname: 'John',
	lname: 'Smith',
	locale: 'en-gb',
	email: 'killer.machine@gmail.com',
	password: bcrypt.hashSync('password123', 10),
	created: date,
	updated: date,
	facebook: {
		token: 'fb-secret-hash'
	},
	clients: [{
		_id: oid('54e50dd551631fc64f6c2fea'),
		udid: 'aaabbbccc'
	}]
});

data.clients = [];
data.clients.push({
	_id: oid('54e50dd551631fc64f6c2fea'),
	user_id: oid('54e50dd551631fc64f6c2fe9'),

	games: [{
		_id: oid('54e50dd551631fc64f6c2fea'),
		title: 'Killer Blood',
		token: 'killler-blood-token'
	}]
});
data.clients.push({
	udid: 'qweasdzxc',
	updated: date,
	registered: date
});

data.games = [];
data.games.push({
	_id: oid('54e50dd551631fc64f6c2fea'),
	title: 'Killer Blood',
	description: 'super killer gangsta game',
	created: date,
	updated: date
});



module.exports = data;