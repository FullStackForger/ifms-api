var Joi = require('joi'),
	userSchema;

userSchema = {
	id: Joi.string().regex(/.[0-9]*/),
	uname: Joi.string(),
	fname: Joi.string(),
	lname: Joi.string(),
	password: Joi.string(),
	email: Joi.string(),	
	locale: Joi.string(), // can be extracted from facebook
	registered: Joi.date().raw,
	updated: Joi.date().raw,
	clients: Joi.array().includes(Joi.string())
};

module.exports = userSchema;