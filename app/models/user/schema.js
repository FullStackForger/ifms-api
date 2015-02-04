var Joi = require('joi'),
	schema;

schema = {
	id: Joi.string().regex(/.[0-9]*/),
	login: Joi.string(),
	password: Joi.string(),
	email: Joi.string(),
	fname: Joi.string(),
	lname: Joi.string(),
	locale: Joi.string(), // can be extracted from facebook
	facebook: {
		id: Joi.string(),
		token: Joi.string(), // token for application
		token_for_business: Joi.string(),
		email: Joi.string()		
	},
	clients: Joi.array().includes(Joi.object().keys({
		id: Joi.string(),
		udid: Joi.string()
	})),
	games: Joi.array().includes(Joi.object().keys({
		id: Joi.string(),
		title: Joi.string(),
		facebook: {
			id: Joi.string(),
			token: Joi.string(), // token for game can be reused across devices
			token_for_business: Joi.string(),
			email: Joi.string()
		},
		store_id: Joi.string() // ObjectId
	}))
};

module.exports = schema;