var Promise = require('mpromise');



function resolve (string) {
	var p = new Promise();

	process.nextTick(function() {
		string = (string || '_') + '_';
		console.log('resolving: '  + string);
		p.fulfill(string);
	});
	return p;
}

function reject (string) {
	var p = new Promise();
	process.nextTick(function() {
		console.log('rejecting: ' + string);
		p.reject(new Error(string));
	});
	return p;
}

//
//fail().then(null, function (err) {
//	console.log(err);
//});
//
//resolve().then(function (data) {
//	console.log(data);
//}, null);


/*
// all promises are called
resolve()
	.onFulfill(reject)
	.onFulfill(resolve)
	.onFulfill(resolve)
	.then(function(data) {
		console.log(data)
	}, function (err) {
		console.log("got error", err);
	});
*/

function handleError(err) {
	console.log('error');
	throw new Error(err);
	return (new Promise()).reject(err);
}

resolve('s')
	.then(resolve)
	.then(reject)
	.then(resolve)
	.then(resolve)
	.onReject(function (error) {
		//console.log('got it');
		throw new Exception(error);
	});



/*
 // all promises are called
(new Promise())
	.chain(reject())
	.chain(resolve())
	.chain(resolve())
	.onReject(function (err) {
		console.log("got error", err);
	});
	*/