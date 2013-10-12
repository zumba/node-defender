var _ = require('underscore');
var tracer = require('tracer').colorConsole({
	level: 'debug',
    format : "{{message}}",
});

module.exports = (function() {

	function Blabber(serverOutput) {
		this.serverOutput = serverOutput;
	};

	Blabber.prototype.debugOutput = function() {
		tracer.debug(this.serverOutput);
	};

	Blabber = _.extend(Blabber, tracer);

	return Blabber;

}());
