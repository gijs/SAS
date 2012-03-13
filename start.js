
/**
 * Module dependencies.
 */
var dbutil = require('./db/generic_dbutil');

var express = require('./node_modules/express');

var app = express.createServer();

require('./webapp').boot(app);

app.listen(8080);
console.log('Express app started on port 8080');