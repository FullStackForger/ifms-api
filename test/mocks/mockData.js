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
	clients: ['aaabbbccc']
});

data.clients = [];
data.clients.push({
	_id: oid('54e50dd551631fc64f6c2fea'),
	user_id: oid('54e50dd551631fc64f6c2fe9'),
	udid: 'aaabbbccc',
	games: [{
		pkey: 'gid01234',
		title: 'Killer Blood',
		token: 'aaabbbccc-token'
	}]
});
data.clients.push({
	_id: oid('54e50dd551631fc64f6c2fea'),
	udid: 'xxxyyyzzz',
	games: [{
		pkey: 'gid01234',
		title: 'Killer Blood',
		token: 'xxxyyyzzz-token'
	}]
});

data.games = [];
data.games.push({
	_id: oid('54e50dd551631fc64f6c2fea'),
	title: 'Killer Blood',
	pkey: 'gid01234',
	description: 'super killer gangsta game',
	created: date,
	updated: date
});



module.exports = data;