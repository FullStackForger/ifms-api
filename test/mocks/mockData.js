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
	_id: oid('54e8cb6fa42352702569eba4'),
	user_id: oid('54e50dd551631fc64f6c2fe9'),
	udid: 'aaabbbccc',
	games: [{
		game_id: oid('54e7f0ab4885ebe47ce15605'),
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
		game_id: oid('54e7f0ab4885ebe47ce15605'),
		title: 'Killer Blood',
		token: {
			signature: 'zzzxxxyyy-token',
			expiry: date
		}
	}]
});

data.games = [];
data.games.push({
	_id: oid('54e7f0ab4885ebe47ce15605'),
	title: 'Killer Blood',
	pkey: 'gid01234',
	description: 'super killer gangsta game',
	created: date,
	updated: date
});

data.game_data = [];
data.game_data.push({
	game_id: oid('54e7f0ab4885ebe47ce15605'),
	client_id: oid('54e8cb6fa42352702569eba4'),
	key: 'save_001',
	value: 'sample saved data string'
},{
	game_id: oid('54e7f0ab4885ebe47ce15605'),
	client_id: oid('54e8cb6fa42352702569eba4'),
	key: 'save_002',
	value: 'second sample saved data string'
});

data.game_scores = [];
data.game_scores.push({
	game_id: oid('54e7f0ab4885ebe47ce15605'),
	client_id: oid('54e8cb6fa42352702569eba4'),
	key: 'level_1_1',
	ds: 123,
	dd: 20150222,
	ws: 222,
	wd: 20150216,
	ms: 222,
	md: 20150201,
	bos: 245
},{
	game_id: oid('54e7f0ab4885ebe47ce15605'),
	client_id: oid('54e8cb6fa42352702569eba4'),
	key: 'level_1_2',
	ds: 111,
	dd: 150222,
	ws: 189,
	wd: 150216,
	ms: 200,
	md: 150201,
	bos: 200
});

module.exports = data;