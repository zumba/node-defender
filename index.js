/* globals process */

// Modules
var _ = require('underscore');
var express = require('express');
var app = express();
var server = require('http').createServer(app);

// Setup Express Server
app.use(express.static(__dirname + '/public'));
app.engine('jade', require('jade').__express);
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');

// Express Routes
app.get('/', function(req, res) {
	res.render('index', {
		host: process.env.HOST || 'http://localhost:8080',
		username: 'test'
	});
});

server.listen(parseInt(process.env.CPORT) || 8081);
