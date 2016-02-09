'use strict';
const
	Hoek = require('hoek'),
	Joi = require('joi'),
	path = require('path'),
	defaults = require('./defaults'),
	schema = require('./schema'),
	configPath = '../../config/config.json';


// init() is used for testing specs
function init() {
	let configJson = {};
	try {
		configJson = require(configPath)
	} catch (e) {
		console.warn('Configuration file is missing: ' + path.resolve(__dirname, configPath))
	}
	let config = Hoek.applyToDefaults(defaults(), configJson),
		validated = Joi.validate(config, schema);

	if (validated.error) {
		throw new Error(validated.error);
	}

	config = validated.value;
	config.init = init;

	return validated.value;
}

//console.log(JSON.stringify(config, null, 2));
module.exports = init();