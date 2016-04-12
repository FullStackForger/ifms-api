var Joi = require('joi');

module.exports = Joi.object().keys({
	env : Joi.string().valid('development', 'testing', 'staging', 'production', 'dev', 'test', 'uat', 'prod'),
	host : Joi.string().hostname().required().raw(),
	port : Joi.string().required(),
	url : Joi.string().required(), // todo: implement regex url validation: https://gist.github.com/dperini/729294
	facebook : {
		clientId: Joi.string().regex(/^.[0-9]*$/),
		clientSecret: Joi.string().alphanum().min(0).max(32)
	},
	mongodb : {
		url : Joi.string(),
		opts : Joi.object()
	},
	"auth": {
		"secret": Joi.string(),
		"algorithm": Joi.string()
	}
});