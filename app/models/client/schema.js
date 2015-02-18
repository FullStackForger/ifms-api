var Joi = require('joi'),
	clientSchema;

clientSchema = {
	id: Joi.string().regex(/.[0-9]*/),
	udid: Joi.string(),	
	registered: Joi.date().raw(),
	updated: Joi.date().raw(),
	games: Joi.array().includes(Joi.object().keys({
		id: Joi.string(),
		title: Joi.string()		
	})),
	token: Joi.object().keys({
		signature: Joi.string(),
		expiry: Joi.date()
	})
};

module.exports = clientSchema;