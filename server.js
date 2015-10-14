var express = require('./express.js');

var http = require('http');
var httpServer = http.createServer(express).listen(8080, function (req, res) {
  console.log('HTTP SERVER has been started');
});

var io = require('socket.io').listen(httpServer);
