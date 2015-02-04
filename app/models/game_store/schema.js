var Joi = require('joi'),
	schema;

schema = {
	id: Joi.string().regex(/.[0-9]*/),
	game_id: Joi.string(),
	user_id: Joi.string(),
	achievements: {
		id: Joi.string(),
		name: Joi.string()
	},
	scores: Joi.array().includes(Joi.object().keys({
		key: Joi.string(),
		val: Joi.number() // timestamp
	})),
	data: Joi.array().includes(Joi.object().keys({
		key: Joi.string(),
		val: [Joi.string(), Joi.number()],
		added: Joi.number() // timestamp
	}))
};

module.exports = schema;