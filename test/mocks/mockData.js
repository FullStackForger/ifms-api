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
	user_id: oid('54e50dd551631fc64f6c2fe9'),
	udid: 'aaabbbccc',
	games: [{
		pkey: 'gid01234',
		title: 'Killer Blood',
		token: {
			signature: 'aaabbbccc-token',
			expiry: date
		}
	}]
});
data.clients.push({
	udid: 'xxxyyyzzz',
	games: [{
		pkey: 'gid01234',
		title: 'Killer Blood',
		token: {
			signature: 'zzzxxxyyy-token',
			expiry: date
		}
	}]
});

data.games = [];
data.games.push({
	title: 'Killer Blood',
	pkey: 'gid01234',
	description: 'super killer gangsta game',
	created: date,
	updated: date
});



module.exports = data;