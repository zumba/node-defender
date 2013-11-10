/* globals process, console, __dirname */

// App Monitoring
require('newrelic');

// Modules
var _ = require('underscore');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var mongoStore = require('connect-mongo')(express);
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var UsernameStrategy = require('passport-username').Strategy;

// Local vars
var sessionConfig, router, middleware;

// Configuration
var config = {
	host: process.env.HOST || 'http://localhost:8080',
	port: parseInt(process.env.PORT, 10) || 8081,
	secure: !!process.env.SECURECLIENT,
	secureUrl: process.env.SECURECLIENTURL || 'http://localhost:8081',
	sessionSecret: process.env.SESSION_SECRET || 'supersecret',
	sessionKey: process.env.SESSION_KEY || 'NODE_DEFENDER_SESSION',
	gaAccount: process.env.GA_ACCOUNT || false,
	twitter: {
		consumerKey: process.env.TWITTER_CONSUMER_KEY,
		consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
		callbackURL: process.env.TWITTER_CALLBACK || null
	}
};

// Passport configuration
passport.use(new UsernameStrategy(
	{},
	function(username, done) {
		done(null, {
			username: username
		});
	}
));
passport.serializeUser(function(user, done) {
	var pruned = {};
	if (!user.profile) {
		pruned = {
			username: user.username
		}
	} else {
		pruned = {
			token: user.token,
			tokenSecret: user.tokenSecret,
			username: user.profile._json.screen_name,
			twitter: _.pick(user.profile._json, ['screen_name', 'profile_image_url_https', 'lang'])
		};
	}
	done(null, pruned);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});
if (config.twitter.consumerKey) {
	passport.use(new TwitterStrategy(
		config.twitter,
		function (token, tokenSecret, profile, done) {
			return done(null, {
				token: token,
				tokenSecret: tokenSecret,
				profile: profile
			});
		}
	));
}

// Setup Express Server
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.bodyParser());
sessionConfig = {
	secret: config.sessionSecret,
	key: config.sessionKey,
	cookie: {
		maxAge: new Date(Date.now() + 1000 * 60 * 60 * 4)
	}
};
if (process.env.MONGO_DSN) {
	sessionConfig.store = new mongoStore({
		url: process.env.MONGO_DSN
	});
} else {
	console.warn('Mongo sessions not activated.');
}
app.use(express.session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.engine('jade', require('jade').__express);
app.set('views', __dirname + '/templates');
app.set('view options', {layout: true});
app.set('view engine', 'jade');
app.locals.gaAccount = config.gaAccount;
app.use(app.router);

// Middleware
middleware = {
	requireAuth: function(req, res, next) {
		if (req.session.passport.user) {
			return next();
		}
		res.redirect('/');
	},
	ensureHttps: function(req, res, next) {
		if (config.secure && req.headers['x-forwarded-proto'] !== 'https') {
			res.redirect(config.secureUrl + req.url);
			return;
		}
		next();
	},
	notFound: function(req, res) {
		res.status(404);
		res.render('404', {
			url: req.url
		});
	}
};

app.use(middleware.notFound);

// Routing methods
router = {
	root: function(req, res) {
		if (req.session.passport.user) {
			return res.redirect('/game');
		}
		res.render('index', {
			host: config.host,
			secure: config.secure
		});
	},
	anonymous: function(req, res) {
		res.redirect('/game');
	},
	oauthCallback: function(req, res) {
		res.redirect('/game');
	},
	logout: function(req, res) {
		req.session.destroy();
		res.redirect('/');
	},
	game: function(req, res) {
		res.render('game', {
			host: config.host,
			username: req.session.passport.user.username,
			secure: config.secure,
			token: req.session.passport.user.token,
			secret: req.session.passport.user.tokenSecret
		});
	}
};

app.all('*', middleware.ensureHttps, function(req, res, next) {
	app.locals.twitter = req.session.passport.user ? req.session.passport.user.twitter : false;
	app.locals.username = req.session.passport.user ? req.session.passport.user.username : false;
	next();
});

// Routes
app.get('/', router.root);
app.post('/anonymous', passport.authenticate('username'), router.anonymous);
app.get('/oauth/connect', passport.authenticate('twitter'));
app.get('/oauth/callback', passport.authenticate('twitter', { failureRedirect: '/' }), router.oauthCallback);
app.get('/logout', router.logout);
app.get('/game', middleware.requireAuth, router.game);

// Route static pages
_.each(['how-to-play'], function(template) {
	app.get('/' + template, function(req, res) {
		res.render(template, {
			host: config.host,
			secure: config.secure
		});
	});
});

server.listen(config.port);
