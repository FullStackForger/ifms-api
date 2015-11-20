// fill below fields and run script

var deviceID = require('crypto').randomBytes(12).toString('hex'),
	gamePKey = 'indieforger/jewelines',
	accessToken = 'eyJhbGciOiJIUzI1NiJ9.MTcwNEFDQTYtNkM0OS01QjFFLTg3QUItRDU4ODg0NkUzRDlFOjE0NDc1MTkzMjE3NjE.0yzOaOwdDO_ruNhePtwpV7rf8RGt0zT-LVvZOfctC6w',
	facebookToken = 'CAAPCZBi4T2DUBADXxdggY6pRJEIbLvKx2SWAsBvJiX9EcRmjyXE5sONUVtmqUJE9L4DQAfMQFXZAkSkYjDTiNjEHsurSwEvoIQX3eyB6DljJ9cCpsq4FjiL4TzLK6SS2u5rVXUCLetjsXxZAruP8IcIXwVssd2k5uQg9w61htvSetUJjbvTNefMYWRxQUmZBxR20W8tXogZDZD';

var log = '\n\n' +
	'Authorization\n' +
	'=============\n' +
	'Oauth ' + (new Buffer('facebook:' + facebookToken, 'utf8').toString('base64')) +
	'\n\n\n' +
	'Ident\n' +
	'=====\n' +
	'Ident ' + (new Buffer(deviceID + ':' + gamePKey, 'utf8').toString('base64')) +
	'\n\n';

console.log(log);