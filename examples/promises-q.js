var Q = require('q');


function resolve(str) {
	return Q.Promise(function (resolve, reject) {
		str = (str || '');
		str += '_';
		console.log('resolving: ' + str);
		resolve(str);
	});
}

function reject(str) {
	return Q.Promise(function (resolve, reject) {
		console.log('rejecting: ' + str);
		reject(new Error(str));
	});
}

function handleError(err) {
	throw new Error(err);
};

resolve('string')
	.then(resolve, handleError)
	.then(reject, handleError)
	.then(resolve, handleError)
	.then(resolve, handleError)
	.catch(function (error) {
		console.error(error);
		throw new Error(error);
	});
