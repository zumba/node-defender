var _ = require('underscore'),
	fs = require('fs'),
	crypto = require('crypto');

module.exports = {
	secureFiles: [
		'blabber.js',
		'brain.js',
		'commander.js',
		'round_info.js',
		'security.js',
		'../index.js'
	],
	generateFileHash: function() {
		var sum = crypto.createHash('md5');
		sum.setEncoding('hex');
		_.each(this.secureFiles, function(file) {
			sum.write(fs.readFileSync(__dirname + '/' + file));
		});
		sum.end();
		return sum.read();
	}
};
