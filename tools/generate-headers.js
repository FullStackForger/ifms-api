// fill below fields and run script

var deviceID = require('crypto').randomBytes(12).toString('hex'),
	gamePKey = 'indieforger/jewelines',
	accessToken = 'eyJhbGciOiJIUzI1NiJ9.YWY3MGE2M2M1NjdlMWIxYTNhMzJjMDFiOjE0NDgwNDc1ODg2Mjk.sKRjQuxOHgk6wUcKvE2f7bs1he0AbFoHiKDiwj_Qk14',
	facebookToken = 'CAAPCZBi4T2DUBAHJEadf1oLomtnTECurByzxjscZBCCZBKZASHMucOiTIwKa2Qria7a3dfVF0I8D7A09yyFBu5Wy5fV4wcjtv3hR81LYOVHA781qZA1JW1ZC9UjpncF5hPHZADsFhtuIUYBD1auZC6FNWIox7LosWKBIbHZAP5C0MlNEqHW63w9P7';

var log = '\n\n' +
	'Authorization\n' +
	'=============\n' +
	'Oauth ' + (new Buffer('facebook:' + facebookToken, 'utf8').toString('base64')) +
	'\n\n' +
	'Bearer ' + accessToken +
	'\n\n\n' +
	'Identification\n' +
	'==============\n' +
	'Ident ' + (new Buffer(deviceID + ':' + gamePKey, 'utf8').toString('base64')) +
	'\n\n';

console.log(log);