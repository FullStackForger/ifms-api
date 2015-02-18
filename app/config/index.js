var Hoek = require('hoek'),
	Joi = require('joi'),
	config = require('./defaults'),
	schema = require('./schema');


config = Hoek.applyToDefaults(config, require('./config.json'));
Joi.validate(config, schema, function (err, validConfig) {
	if (err !== null) {
		throw new Error(err);
	}
	config = validConfig;
});

//console.log(JSON.stringify(config, null, 2));
module.exports = config;