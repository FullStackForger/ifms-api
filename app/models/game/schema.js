var Joi = require('joi'),
	gameSchema;

gameSchema = {
	id: Joi.string().regex(/.[0-9]*/),
	title: Joi.string(),
	description: Joi.string(),
	links: {
		www: Joi.string().hostname(),
		ios: Joi.string().hostname(),
		osx: Joi.string().hostname(),
		mss: Joi.string().hostname(),
		osx: Joi.string().hostname() 		
	},
	achievements: Joi.array(),
	images: {
		thumb100x100: Joi.string(),
		banner600x200: Joi.string(),
		banner1200x300: Joi.string()
	},
	pkey: Joi.string(),
	created: Joi.date().raw(),
	updated: Joi.date().raw(),
	author: {
		id: Joi.string(),
		name: Joi.string(),
		company: Joi.string()
	},
	version: Joi.string()
};

module.exports = gameSchema;