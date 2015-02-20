module.exports = {

	/**
	 * @param {Object} ident
	 * @param {String} ident.pkey public game key
	 * @param {String} ident.udid unique device id
	 * @returns {String}
	 */
	toBase64: function (ident) {
		var chain = ident.udid + ':' + ident.pkey;
		return (new Buffer(chain, 'utf8')).toString('base64');

	},
	
	/**
	 * @param string base64 string made of pkey:udid
	 * @returns {{pkey: *, udid: *}}
	 */
	parse: function (string) {
		var chunks;
		
		if (!string) return null;

		string = Buffer(string, 'base64').toString();
		chunks = string.split(':');
		return {
			udid: chunks[0],
			pkey: chunks[1]
		}
	}
}