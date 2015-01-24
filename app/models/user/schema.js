var Joi = require('joi'),
	schema;

schema = {
	id : Joi.string().regex(/.[0-9]*/),
	login : Joi.string(),
	email : Joi.string(),
	fname : Joi.string(),
	lname : Joi.string(),
	locale: Joi.string(), // can be extracted from facebook
	facebook : {
		id  : Joi.string(),
		token: Joi.string(),
		token_for_business: Joi.string(),
		email : Joi.string()		
	}
};

module.exports = schema;