var Joi = require('joi'),
	userSchema;

userSchema = {
	id: Joi.string().regex(/.[0-9]*/),
	uname: Joi.string().required(),
	fname: Joi.string(),
	lname: Joi.string(),
	password: Joi.string(),
	email: Joi.string(),
	locale: Joi.string(), // can be extracted from facebook
	created: Joi.date().required(),
	updated: Joi.date().required(),
	facebook: Joi.object(),
	// array of UDIDs
	clients: Joi.array().includes(Joi.string()).min(0).required()
};

module.exports = userSchema;