var Joi = require('joi');

module.exports = Joi.object().keys({
	env : Joi.string().valid('development', 'testing', 'production', 'dev', 'test', 'uat', 'prod'),
	host : Joi.string().hostname().required().raw(),
	port : Joi.number().min(80).max(9999).required(),
	url : Joi.string().required(), // todo: implement regex url validation: https://gist.github.com/dperini/729294
	facebook : {
		clientId: Joi.string().length(15).regex(/^.[0-9]*$/).required(),
		clientSecret: Joi.string().alphanum().length(32).required()
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