var Joi = require('joi'),
	clientSchema;

clientSchema = {
	user_id: Joi.object(),
	udid: Joi.string(),
	uname: Joi.string(),
	registered: Joi.date().raw(),
	updated: Joi.date().raw(),
	agent: Joi.string(),
	games: Joi.array().includes(Joi.object().keys({
		game_id: Joi.object(),
		title: Joi.string(),
		token: Joi.object().keys({
			signature: Joi.string(),
			expiry: Joi.date()
		})
	}))
};

module.exports = clientSchema;