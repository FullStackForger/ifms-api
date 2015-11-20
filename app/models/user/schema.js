var Joi = require('joi'),
	userSchema;

userSchema = {
	id: Joi.string().regex(/.[0-9]*/),
	uname: Joi.string(), // user name
	name: Joi.string(), // full name
	fname: Joi.string(), // first name
	lname: Joi.string(), // last name
	email: Joi.string(),
	password: Joi.string(),
	locale: Joi.string(),
	birthday: Joi.string(),
	gender: Joi.string(),
	created: Joi.date().required(),
	updated: Joi.date().required(),
	facebook: Joi.object().keys({
		token: Joi.string(),
		id: Joi.string(),
		link: Joi.string(),
		picture: Joi.string()
	}),
	// array of UDIDs
	clients: Joi.array().includes(Joi.string()).min(0).required()
};

module.exports = userSchema;