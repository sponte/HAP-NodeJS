var sys = require('sys');
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) };

function LRFController(timeout) {
  this.timeout = timeout || 100;
  this.queue = [];
  this.ready = true;
}

LRFController.prototype.send = function(cmd, callback) {
  //sendCmdToLRF(cmd);
  exec(cmd);
  if (callback) callback();
  // or simply `sendCmdToLRF(cmd, callback)` if sendCmdToLRF is async
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

function LRFController() {
	if (!(this instanceof LRFController))  {
		return new LRFController();
	}
        this.timeout = 100;
        this.queue = [];
        this.ready = true;
}

module.exports = {
	LRFController: LRFController
};
