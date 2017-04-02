var http = require('http');
	
var bts = require('../');

var app = bts('./playground/www');

http.createServer(app).listen(8181, function(){
    console.log('Listening on port 8181');
});