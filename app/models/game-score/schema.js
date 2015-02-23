var Joi = require('joi'),
	gameDataSchema;

gameDataSchema = {	
	game_id: Joi.object(),
	client_id: Joi.object(),
	key: Joi.string(),
	// daily score
	ds: Joi.number(),   
	// daily date scope, eg: 20150222
	dd: Joi.number().min(150201).max(500000),
	// daily score
	ws: Joi.number(),
	// daily date scope
	wd: Joi.number().min(150201).max(500000),
	// monthly score
	ms: Joi.number(),
	// monthly date scope
	md: Joi.number().min(150201).max(500000),
	// best overall score
	bos: Joi.number()
};

module.exports = gameDataSchema;