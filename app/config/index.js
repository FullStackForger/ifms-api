var Hoek = require('hoek'),
	Joi = require('joi'),
	defaults = require('./defaults'),
	schema = require('./schema'),
	options = [],
	config = defaults;

// todo: extract options to individual files
// todo: add files to dev/ folder with appropriate notes in README and bash script

options["development"] = {
	url: 'http://dev.bevelgames.com',
	facebook : {
		clientId: '792772680815526',
		clientSecret: 'fc887256bfe59f6150c62c0b7146a4c6'
	}
};

options["testing"] = {
	url: 'http://uat.bevelgames.com',
	facebook : {
		clientId: '',
		clientSecret: ''
	}
};

options["production"] = {
	url: 'https://bevelgames.com',
	facebook : {
		clientId: '',
		clientSecret: ''
	}
};

if (options[defaults.env]) {
	config = Hoek.applyToDefaults(defaults, options[defaults.env]);
	Joi.validate(config, schema, function (err, validConfig) {
		if (err !== null) {
			throw new Error(err);
		}
		config = validConfig;
	});
}

console.log(JSON.stringify(config, null, 2));
module.exports = config;