var Joi = require('joi'),
	schema;

schema = {
	id: Joi.string().regex(/.[0-9]*/),
	udid: Joi.string(),	
	registered: Joi.date().format('YYYYMMDD').raw(),
	updated: Joi.date().format('YYYYMMDD').raw(),
	games: Joi.array().includes(Joi.object().keys({
		id: Joi.string(),
		title: Joi.string()		
	})),
	token: Joi.object().keys({
		signature: Joi.string(),
		expiry: Joi.date()
	})
};

module.exports = schema;