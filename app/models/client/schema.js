var Joi = require('joi'),
	clientSchema;

clientSchema = {
	user_id: Joi.object(),
	udid: Joi.string(),	
	registered: Joi.date().raw(),
	updated: Joi.date().raw(),
	agent: Joi.string(),
	games: Joi.array().includes(Joi.object().keys({
		pkey: Joi.string(),
		title: Joi.string(),
		token: Joi.object().keys({
			signature: Joi.string(),
			expiry: Joi.date()
		})
	}))
};

module.exports = clientSchema;