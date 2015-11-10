var moment = require('moment'),
	data = {},
	date = new Date(),
	oid = require('mongodb').ObjectID.createFromHexString,
	bcrypt = require('bcrypt');

/* ---------[ users ]-------------------- */

data.users = [];
data.users.push({
	_id: oid('2e7eeeeeeeeeeeeeeeeeeee1'),
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


/* ---------[ clients ]-------------------- */

data.clients = [];
data.clients.push({
	_id: oid('ccccccccccccccccccccccc1'),
	user_id: oid('2e7eeeeeeeeeeeeeeeeeeee1'),
	uname: 'KillerMachine',
	udid: 'aaabbbccc',
	games: [{
		game_id: oid('3e5eeeeeeeeeeeeeeeeeeee1'),
		title: 'Killer Blood',
		token: {
			signature: 'aaabbbccc-token',
			expiry: date
		}
	}]
});
data.clients.push({
	_id: oid('ccccccccccccccccccccccc2'),
	uname: 'Guest 1',
	udid: 'zzzxxxyyy-2',
	games: [{
		game_id: oid('3e5eeeeeeeeeeeeeeeeeeee1'),
		title: 'Killer Blood',
		token: {
			signature: 'zzzxxxyyy-token-2',
			expiry: date
		}
	}]
},{
	_id: oid('ccccccccccccccccccccccc3'),
	uname: 'Guest 2',
	udid: 'zzzxxxyyy-3',
	games: [{
		game_id: oid('3e5eeeeeeeeeeeeeeeeeeee1'),
		title: 'Killer Blood',
		token: {
			signature: 'zzzxxxyyy-token-3',
			expiry: date
		}
	}]
},{
	_id: oid('ccccccccccccccccccccccc4'),
	uname: 'Guest 3',
	udid: 'zzzxxxyyy-4',
	games: [{
		game_id: oid('3e5eeeeeeeeeeeeeeeeeeee1'),
		title: 'Killer Blood',
		token: {
			signature: 'zzzxxxyyy-token-4',
			expiry: date
		}
	}]
},{
	_id: oid('ccccccccccccccccccccccc5'),
	uname: 'Guest 4',
	udid: 'xxxyyyzzz',
	games: [{
		game_id: oid('3e5eeeeeeeeeeeeeeeeeeee1'),
		title: 'Killer Blood',
		token: {
			signature: 'zzzxxxyyy-token-5',
			expiry: date
		}
	}]
});

/* ---------[ games ]-------------------- */

data.games = [];
data.games.push({
	_id: oid('3e5eeeeeeeeeeeeeeeeeeee1'),
	title: 'Killer Blood',
	pkey: 'gid01234',
	description: 'super killer gangsta game',
	created: date,
	updated: date,
	version: '0.1.0'
});

/* ---------[ game data ]-------------------- */

data.data = [];
data.data.push({
	game_id: oid('3e5eeeeeeeeeeeeeeeeeeee1'),
	client_id: oid('ccccccccccccccccccccccc1'),
	key: 'save_001',
	value: 'sample saved data string'
},{
	game_id: oid('3e5eeeeeeeeeeeeeeeeeeee1'),
	client_id: oid('ccccccccccccccccccccccc1'),
	key: 'save_002',
	value: 'second sample saved data string'
});

/* ---------[ game score ]-------------------- */

//client 1
data.score = [];
data.score.push({
	game_id: oid('3e5eeeeeeeeeeeeeeeeeeee1'),
	client_id: oid('ccccccccccccccccccccccc1'),
	key: 'level_1_1',
	ds: 111,
	// yesterday
	dd: parseInt(moment().startOf('today').subtract(1, 'd').format('YYMMDD')),
	ws: 222,
	// week starts from Monday!
	wd: parseInt(moment().startOf('week').format('YYMMDD')),
	ms: 333,
	md: parseInt(moment().startOf('month').format('YYMMDD')),
	bos: 444
},{
	game_id: oid('3e5eeeeeeeeeeeeeeeeeeee1'),
	client_id: oid('ccccccccccccccccccccccc1'),
	key: 'level_1_2',
	ds: 2010,
	dd: parseInt(moment().startOf('day').format('YYMMDD')),
	ws: 2020,
	wd: parseInt(moment().startOf('week').format('YYMMDD')),
	ms: 2030,
	md: parseInt(moment().startOf('month').format('YYMMDD')),
	bos: 2040
});

//more clients with level_1_1
data.score.push({
	game_id: oid('3e5eeeeeeeeeeeeeeeeeeee1'),
	client_id: oid('ccccccccccccccccccccccc2'),
	key: 'level_1_1',
	ds: 10,
	// yesterday
	dd: parseInt(moment().startOf('today').format('YYMMDD')),
	ws: 10,
	// week starts from Monday!
	wd: parseInt(moment().startOf('week').format('YYMMDD')),
	ms: 10,
	md: parseInt(moment().startOf('month').format('YYMMDD')),
	bos: 10
},{
	game_id: oid('3e5eeeeeeeeeeeeeeeeeeee1'),
	client_id: oid('ccccccccccccccccccccccc3'),
	key: 'level_1_1',
	ds: 20,
	// yesterday
	dd: parseInt(moment().startOf('today').format('YYMMDD')),
	ws: 20,
	// week starts from Monday!
	wd: parseInt(moment().startOf('week').format('YYMMDD')),
	ms: 20,
	md: parseInt(moment().startOf('month').format('YYMMDD')),
	bos: 20
},{
	game_id: oid('3e5eeeeeeeeeeeeeeeeeeee1'),
	client_id: oid('ccccccccccccccccccccccc4'),
	key: 'level_1_1',
	ds: 1000,
	// yesterday
	dd: parseInt(moment().startOf('today').format('YYMMDD')),
	ws: 1000,
	// week starts from Monday!
	wd: parseInt(moment().startOf('week').format('YYMMDD')),
	ms: 1000,
	md: parseInt(moment().startOf('month').format('YYMMDD')),
	bos: 1000
},{
	game_id: oid('3e5eeeeeeeeeeeeeeeeeeee1'),
	client_id: oid('ccccccccccccccccccccccc5'),
	key: 'level_1_1',
	ds: 2000,
	// yesterday
	dd: parseInt(moment().startOf('today').format('YYMMDD')),
	ws: 2000,
	// week starts from Monday!
	wd: parseInt(moment().startOf('week').format('YYMMDD')),
	ms: 2000,
	md: parseInt(moment().startOf('month').format('YYMMDD')),
	bos: 2000
});

//client 3
module.exports = data;