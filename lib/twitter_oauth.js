var oauth = require('oauth');

module.exports = {
	consumer: function() {
		return new oauth.OAuth(
    		"https://twitter.com/oauth/request_token", 
    		"https://twitter.com/oauth/access_token", 
    		process.env.TWITTER_CONSUMER_KEY, 
    		process.env.TWITTER_CONSUMER_SECRET, 
    		"1.0A", 
    		process.env.TWITTER_CALLBACK || null, 
    		"HMAC-SHA1"
    	);   
	}
}
