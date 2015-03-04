var Hoek = require('hoek'),
	Joi = require('joi'),
	defaults = require('./defaults'),
	configJson = require('../../config/config.json'),
	schema = require('./schema');


// init() is used for testing specs
function init() {
	var config = Hoek.applyToDefaults(defaults(), configJson),
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