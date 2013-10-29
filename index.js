/* globals process */

// Modules
var _ = require('underscore');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var mongoStore = require('connect-mongo')(express);

// Lib
var TwitterOauth = require('./lib/twitter_oauth.js');

// Local vars
var sessionConfig, router;

// Configuration
var config = {
	host: process.env.HOST || 'http://localhost:8080',
	port: parseInt(process.env.PORT) || 8081,
	secure: !!process.env.SECURECLIENT,
	secureUrl: process.env.SECURECLIENTURL || 'http://localhost:8081',
	sessionSecret: process.env.SESSION_SECRET || 'supersecret',
	sessionKey: process.env.SESSION_KEY || 'NODE_DEFENDER_SESSION',
	gaAccount: process.env.GA_ACCOUNT || false
}

// Setup Express Server
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.bodyParser());
sessionConfig = {
	secret: config.sessionSecret,
	key: config.sessionKey
};
if (process.env.MONGO_DSN) {
	sessionConfig.store = new mongoStore({
		url: process.env.MONGO_DSN
	});
} else {
	console.warn('Mongo sessions not activated.');
}
app.use(express.session(sessionConfig));
app.engine('jade', require('jade').__express);
app.set('views', __dirname + '/templates');
app.set('view options', {layout: true});
app.set('view engine', 'jade');
app.locals.gaAccount = config.gaAccount;
app.use(app.router);

// Middleware
app.use(function(req, res, next) {
	if (config.secure && req.headers['x-forwarded-proto'] != 'https') {
		res.redirect(config.secureUrl + req.url);
		return;
	}
	next();
});
app.use(function(req, res) {
	res.status(404);
	res.render('404', {
		url: req.url
	});
});

// Routing methods
router = {
	root: function(req, res) {
		if (typeof req.session.username !== 'undefined') {
			res.redirect('/game');
			return;
		}
		res.render('index');
	},
	anonymous: function(req, res) {
		req.session.username = req.body.username
		res.redirect('/game');
	},
	oauthConnect: function(req, res) {
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
				res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + req.session.oauthRequestToken);      
			}
		});
	},
	oauthCallback: function(req, res) {
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
	},
	logout: function(req, res) {
		req.session.destroy();
		res.redirect('/');
	},
	game: function(req, res) {
		if (typeof req.session.username === 'undefined') {
			res.redirect('/');
		}
		res.render('game', {
			host: config.host,
			username: req.session.username,
			secure: config.secure,
			token: req.session.oauthAccessToken,
			secret: req.session.oauthAccessTokenSecret
		});
	}
};

// Routes
app.get('/', router.root);
app.post('/anonymous', router.anonymous);
app.get('/oauth/connect', router.oauthConnect);
app.get('/oauth/callback', router.oauthCallback);
app.get('/logout', router.logout);
app.get('/game', router.game);

// Route static static pages
_.each(['how-to-play'], function(template) {
	app.get('/' + template, function(req, res) {
		res.render(template);
	});
});

server.listen(config.port);
