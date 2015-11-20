var http = require('http'),
	port = 8001,
	delay = 10, //seconds,
	timeout = false,
	host = '127.0.0.1';

/**
 * Usage;
 *
 * example usage:
 * node timout-server host=127.0.0.1 port=80 delay=10 timeout=false
 *
 * to timeout connections use:
 * node timeout-server timeout=true
 */
var server = http.createServer(function (req, res) {
	console.log('REQ:' + req.headers.host + req.url);

	process.argv.forEach(function (val, index, array) {
		var bits = val.toString().split('=');
		if (bits.length == 2) {
			switch(bits[0]) {
				case 'host':
					host = bits[1];
					break;
				case 'port':
					port = bits[1];
					break;
				case 'delay':
					delay = bits[1];
					break;
				case 'timeout':
					timeout = bits[1] == true || bits[1] == 'true';
					break;
			}
		}
	});

	var msDelay = (req.url != '/favicon.ico') ? delay * 1000: 0;
	setTimeout(function () {


		if (timeout) {
			console.log('RES:' + req.headers.host + req.url + '\t[504]');
			res.writeHead(504, {'Content-Type': 'text/text'});
			res.end();
			//res.end('{error: "connection timeout"}');
		} else {
			console.log('RES:' + req.headers.host + req.url + '\t[200]');
			res.writeHead(200, {'Content-Type': 'text/json'});
			res.end('{status: ok}');
		}

	}, msDelay);

}).listen(port, host);

console.log('server started at: http://' + host + ':' + port + ' with responses delayed ' + delay + 's');
