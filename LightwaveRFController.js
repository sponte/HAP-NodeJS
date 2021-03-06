var sys = require('sys');
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) };


LRFController.prototype.send = function(cmd, callback) {
  exec(cmd, callback);
  //if (callback) callback();
};

LRFController.prototype.exec = function() {
  this.queue.push(arguments);
  this.process();
};

LRFController.prototype.process = function() {
  if (this.queue.length === 0) return;
  if (!this.ready) return;
  var self = this;
  this.ready = false;
  this.send.apply(this, this.queue.shift());
  setTimeout(function () {
    self.ready = true;
    self.process();
  }, this.timeout);
};

function LRFController(timeout) {
	if (!(this instanceof LRFController))  {
		return new LRFController(timeout);
	}
        this.timeout = timeout || 1000;
        this.queue = [];
        this.ready = true;
}

module.exports = {
	LRFController: LRFController
};
