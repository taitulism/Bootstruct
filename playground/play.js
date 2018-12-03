/* eslint-disable */
'use strict';

const http = require('http');

const bts = require('../');
const app = bts(__dirname + '/www');

http.createServer(app).listen(8080, () => {
    console.log('Listening on port 8080');
});
