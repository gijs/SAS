
/**
 * Module dependencies.
 */
var dbutil = require('./db/generic_dbutil');
var express = require('./node_modules/express');
var cluster = require('cluster');

var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('death', function(worker) {
    console.log('worker ' + worker.pid + ' died');
    cluster.fork();
  });
}else{
	var app = express.createServer();
	require('./webapp').boot(app);
	app.listen(8080);
	console.log('Express app started on port 8080');
}
