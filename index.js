var Hapi = require('hapi'),
    Routes = require('./app/routes'),
    server;


server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8080
});

server.route(Routes);

server.start();