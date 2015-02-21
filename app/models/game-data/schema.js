var Joi = require('joi'),
	gameDataSchema;

gameDataSchema = {
	game_id: Joi.object(),
	user_id: Joi.object(),
	key: Joi.string(),
	value: Joi.string()
};

module.exports = gameDataSchema;