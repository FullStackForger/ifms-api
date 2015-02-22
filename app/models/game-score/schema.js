var Joi = require('joi'),
	gameDataSchema;

gameDataSchema = {	
	game_id: Joi.object(),
	client_id: Joi.object(),
	key: Joi.string(),
	// daily score
	ds: Joi.number(),   
	// daily date scope, eg: 20150222
	dd: Joi.number().min(20150201).max(20500000),
	// daily score
	ws: Joi.number(),
	// daily date scope
	wd: Joi.number().min(20150201).max(20500000),
	// monthly score
	ms: Joi.number(),
	// monthly date scope
	md: Joi.number().min(20150201).max(20500000),
	// total score
	ts: Joi.number()
};

module.exports = gameDataSchema;