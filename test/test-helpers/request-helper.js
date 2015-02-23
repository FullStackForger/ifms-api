var request = module.exports = {},
	internals = {};

internals.toBase64 = function (string) {
	return new Buffer(string, 'utf8').toString('base64');
};

internals.validAuth = 'Bearer aaabbbccc-token';
internals.invalidAuth = 'Bearer invalid-token';
internals.illegaAuth = 'illegal-token';
internals.validIdent = 'Ident ' + internals.toBase64('aaabbbccc:gid01234', 'utf8');
internals.invalidIdentUDID = 'Ident ' + internals.toBase64('bad_udid:gid01234', 'utf8');
internals.invalidIdentPKey = 'Ident ' + internals.toBase64('aaabbbccc:bad_pkey', 'utf8');
internals.illegalIndent = 'Ident ' + internals.toBase64('illegal-indent', 'utf8');

request.getValidRequest = function () {
	return {
		method: 'GET',
		headers: {
			authorization: internals.validAuth,
			identification: internals.validIdent
		}
	};
};

request.getIllegalIndent = function () {
	return {
		method: 'GET',
		headers: {
			authorization: internals.validAuth,
			identification: internals.illegalIndent
		}
	};
};

request.getIllegalToken = function () {
	return {
		method: 'GET',
		headers: {
			authorization: internals.illegaAuth,
			identification: internals.validIdent
		}
	};
};

request.getInvalidIdentUDID = function () {
	return {
		method: 'GET',
		headers: {
			authorization: internals.validAuth,
			identification: internals.invalidIdentUDID
		}
	};
};

request.getInvalidIdentPKey = function () {
	return {
		method: 'GET',
		headers: {
			authorization: internals.validAuth,
			identification: internals.invalidIdentPKey
		}
	};
};

request.getMissingIdent = function () {
	return {
		method: 'GET',
		headers: {
			authorization: internals.validAuth
		}
	}
};

request.getMissingToken = function () {
	return {
		method: 'GET',
		identification: internals.validIdent
	}
};