var Promise = require('promise');



function resolve () {
	var p = new Promise();
	process.nextTick(function() {
		console.log('resolving');
		p.resolve('ok');
	});
	return p;
}

function reject () {
	var p = new Promise();
	process.nextTick(function() {
		console.log('rejecting');
		p.reject(new Error('some error'));
	});
	return p;
}

resolve()
	.then(reject)
	.then(resolve)
	.then(resolve)
	.then(null, function (error) {
		console.log('got error:', error);
	});