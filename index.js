/* globals process */

// Modules
var _ = require('underscore');
var express = require('express');
var app = express();
var server = require('http').createServer(app);

// Lib
var TwitterOauth = require('./lib/twitter_oauth.js');

// Local vars
var port = parseInt(process.env.PORT) || 8081;

// Setup Express Server
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({
	secret: process.env.SESSION_SECRET || 'supersecret',
	key: process.env.SESSION_KEY || 'NODE_DEFENDER_SESSION'
}));
app.engine('jade', require('jade').__express);
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');

// Express Routes
app.get('/', function(req, res) {
	if (typeof req.session.username !== 'undefined') {
		res.redirect('/game');
		return;
	}
	res.render('index');
});

app.post('/anonymous', function(req, res) {
	req.session.username = req.body.username
	res.redirect('/game');
});

app.get('/oauth/connect', function(req, res) {
	if (!process.env.TWITTER_CONSUMER_KEY || !process.env.TWITTER_CONSUMER_SECRET) {
		console.error('Twitter consumer key or secret not defined.');
		res.redirect('/');
		return;
	}
	TwitterOauth.consumer().getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
		if (error) {
			res.send("Error getting OAuth request token : " + error, 500);
			return;
		} else {
			req.session.oauthRequestToken = oauthToken;
			req.session.oauthRequestTokenSecret = oauthTokenSecret;
			res.redirect("https://twitter.com/oauth/authorize?oauth_token=" + req.session.oauthRequestToken);      
		}
	});
});

app.get('/oauth/callback', function(req, res) {
	TwitterOauth.consumer().getOAuthAccessToken(
		req.session.oauthRequestToken, 
		req.session.oauthRequestTokenSecret, 
		req.query.oauth_verifier,
		function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
			if (error) {
				console.error(error, results);
				res.send('Error getting OAuth access token', 500);
				return;
			}
			req.session.oauthAccessToken = oauthAccessToken;
			req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;

			TwitterOauth.consumer().get(
				"https://api.twitter.com/1.1/account/verify_credentials.json", 
				req.session.oauthAccessToken, 
				req.session.oauthAccessTokenSecret, 
				function (error, data, response) {
					if (error) {
						console.error(error);
						res.send('Error getting twitter information.', 500);
						return;
					}
					req.session.twitter = _.pick(JSON.parse(data), ['screen_name', 'profile_image_url_https', 'lang'])
					req.session.username = req.session.twitter.screen_name;
					res.redirect('/game');
				}
			);
		}
	);
});

app.get('/game', function(req, res) {
	if (typeof req.session.username === 'undefined') {
		res.redirect('/');
	}
	res.render('game', {
		host: process.env.HOST || 'http://localhost:8080',
		username: req.session.username,
		secure: !!process.env.SECURECLIENT
	});
});

console.log('Starting up on port ' + port);
server.listen(port);
