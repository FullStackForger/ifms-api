var User = require('../../models/user');

function userDetailsHandler (request, reply) {
	reply(new User({
		id : 111111,
		login : "mock-user-login"
	}));
	
	console.log('--------------');
	var u = User.new({id: 'happy'});
	console.log(u.toJSON());
	console.log(u.toString());
	User.find();
	User.register();
	console.log('--------------end.');
};

module.exports = {
	userDetailsHandler: userDetailsHandler
};