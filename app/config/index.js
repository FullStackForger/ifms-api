var Hoek = require('hoek'),
	Joi = require('joi'),
	defaults = require('./defaults'),
	schema = require('./schema'),
	options = [],
	config;

// todo: extract options to individual files
// todo: add files to dev/ folder with appropriate notes in README and bash script

options["development"] = {
	facebook : {
		clientId: '792772680815526',
		clientSecret: 'fc887256bfe59f6150c62c0b7146a4c6'
	}
};

options["testing"] = {


};

options["production"] = {

};


config = Hoek.applyToDefaults(defaults, options[defaults.env]);

Joi.validate(config, schema, function (err, value) {
	if (err !== null) {
		throw new Error(err);
	}
});

module.exports = config;