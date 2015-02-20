module.exports = {

	/**
	 * @param {Object} ident
	 * @param {String} ident.pkey public game key
	 * @param {String} ident.udid unique device id
	 * @returns {String}
	 */
	toBase64: function (ident) {
		var chain = 'Ident ' + ident.udid + ':' + ident.pkey;
		return (new Buffer(chain, 'utf8')).toString('base64');
	},

	/**
	 * @param string base64 string made of pkey:udid
	 * @returns {{pkey: *, udid: *}}
	 */
	parse: function (string) {
		var chunks;
		
		if (!string) return null;

		chunks = string.split(' ');
		
		if (chunks.length != 2 || chunks[0].toLowerCase() !== 'ident') {
			return null;
		}
		
		string = Buffer(chunks[1], 'base64').toString();
		chunks = string.split(':');
		if (chunks.length != 2) {
			return null;
		}
		
		return {
			udid: chunks[0],
			pkey: chunks[1]
		}
	}
}