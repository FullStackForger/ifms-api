var env = process.env.NODE_ENV || 'development',
	host = process.env.NODE_HOST || '127.0.0.1',
	port = process.env.NODE_PORT || '8000',
	warnings = '',
	defaults;

if (!process.env.NODE_ENV) {
	warnings += '\nWARNING! Missing environment variable NODE_ENV, "' + env + '" has been used';
} 
if (!process.env.NODE_HOST) {
	warnings += '\nWARNING! Missing environment variable NODE_HOST, "' + host + '" has been used';
} 
if (!process.env.NODE_PORT) {
	warnings += '\nWARNING! Missing environment variable NODE_PORT, "' + port + '" has be used';
}
if (warnings.length > 0) {
	warnings = '\n\n**************** STARTUP WARNINGS ********************' + warnings;
	warnings += '\n********************************************************\n\n';
	console.log(warnings);
}

var defaults = {
	env : env,
	host : host,
	port : port,
	url : "http://localhost",
	facebook : {
		clientId: null,
		clientSecret: null
	}
};

defaults.url = 'http://' + defaults.host + ':' + defaults.port;
defaults.url = "127.0.0.1";
module.exports = defaults;