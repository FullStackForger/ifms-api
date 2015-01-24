var Hoek = require('hoek'),
	Joi = require('joi'),
	hapiapp = {};

hapiapp.createModel = function (modelName, path) {
	var dao, helpers, schema, key, validation, Model;

	if (arguments.length < 2) {
		throw new Error("'modelName' and 'path' parameters are required. Check Model Schema.");
	}

	validation = Joi.validate(modelName, Joi.string());
	if (validation.error != null) {
		throw new Error("'modelName' parameter error: " + validation.error + ". Check Model Schema.");
	}

	validation = Joi.validate(path, Joi.string());
	if (validation.error != null) {
		throw new Error("'path' parameter error: " + validation.error + " . Check Model Schema.");
	}

	dao = require(path + '/dao'),
	helpers = require(path + '/helpers'),
	schema = require(path + '/schema');

	Model = function (data) {
		if (Joi.validate(data, Joi.object()).error != null) {
			throw new Error('data parameter must be an object. Check schema definition.');
		}

		for (key in data) {
			if (data.hasOwnProperty(key)) {
				this[key] = data[key];
			}
		}
	};		
	
	for (key in dao) {
		if (dao.hasOwnProperty(key)) {
			Model[key] = dao[key];
		}
	}

	helpers.validate = function () {

		
	};
	
	helpers.toJSON = function () {
		return JSON.parse(JSON.stringify(JSON.stringify(Hoek.applyToDefaults({}, this))));
	};
	
	helpers.toString = function () {
		return JSON.stringify(JSON.stringify(Hoek.applyToDefaults({}, this)), null, 4);
	};
	
	for (key in helpers) {
		if (helpers.hasOwnProperty(key)) {
			Model.prototype[key] = helpers[key];
		}
	}

	Model.name = modelName;
	Model.schema = schema;
	Model.new = function (data) {
		return new Model(data);
	}
	
	Model.prototype.constructor = Model;
	
	return Model;
};
	
module.exports = hapiapp;