var storage = require('node-persist');

var accessory_Factor = new require("./Accessory.js");
var accessoryController_Factor = new require("./AccessoryController.js");
var service_Factor = new require("./Service.js");
var characteristic_Factor = new require("./Characteristic.js");

var accessoryFunnel = new require("./AccessoryFunnel.js")

var sys = require('sys');
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) };


console.log("HAP-NodeJS starting...");


//var lightcmd = "python /home/xbian/pyharmony/harmony turn_off";
//console.log(lightcmd);
//exec(lightcmd);

storage.initSync();

var accessoryController = new accessoryController_Factor.AccessoryController();
var infoService = accessoryFunnel.generateAccessoryInfoService(service_Factor,"Test Accessory 1","Rev 1","A1S2NASF88EW","Nlr");
var lightService = accessoryFunnel.generateLightService(service_Factor);
accessoryController.addService(infoService);
accessoryController.addService(lightService);

var accessory = new accessory_Factor.Accessory("Test Accessory 1", "1A:2B:3C:4D:5E:FF", storage, parseInt(51822), "031-45-154", accessoryController);
accessory.publishAccessory();
