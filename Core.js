var storage = require('node-persist');

var accessory_Factor = new require("./Accessory.js");
var accessoryController_Factor = new require("./AccessoryController.js");
//var service_Factor = new require("./Service.js");
var characteristic_Factor = new require("./Characteristic.js");

var accessoryFunnel = require("./AccessoryFunnel.js")
var accessoryGreggs = require("./AccessoryGreggs.js")

var lightwaveRFController_Factor = new require("./LightwaveRFController.js")
var lightwaveRFController = new lightwaveRFController_Factor.LRFController();

console.log("HAP-NodeJS starting...");


//var lightcmd = "python /home/xbian/pyharmony/harmony turn_off";
//console.log(lightcmd);
//exec(lightcmd);

storage.initSync();


var accessoryControllerFunnel = new accessoryController_Factor.AccessoryController();

var infoServiceFunnel = accessoryFunnel.generateAccessoryInfoService("Light Funnel","Rev 1","A1S2NASF88EW","Nlr");
var lightServiceFunnel = accessoryFunnel.generateLightService(lightwaveRFController);
accessoryControllerFunnel.addService(infoServiceFunnel);
accessoryControllerFunnel.addService(lightServiceFunnel);

//var accessoryFunnel = new accessory_Factor.Accessory("Light Funnel", "1A:2B:3C:4D:5E:FF", storage, parseInt(31822), "031-45-154", accessoryControllerFunnel);
//accessoryFunnel.publishAccessory();


var accessoryControllerGreggs = new accessoryController_Factor.AccessoryController();

var infoServiceGreggs = accessoryGreggs.generateAccessoryInfoService("Light Greggs","Rev 1","A1S2NASF88EW","Nlr");
var lightServiceGreggs = accessoryGreggs.generateLightService(lightwaveRFController);
accessoryControllerGreggs.addService(infoServiceGreggs);
accessoryControllerGreggs.addService(lightServiceGreggs);


var accessoryFunnel = new accessory_Factor.Accessory("Light Funnel", "1A:2B:3C:4D:5E:FF", storage, parseInt(31822), "031-45-154", accessoryControllerFunnel);
accessoryFunnel.publishAccessory();

var accessoryGreggs = new accessory_Factor.Accessory("Light Greggs", "CA:2B:3C:4D:5E:BC", storage, parseInt(51822), "031-45-154", accessoryControllerGreggs);
accessoryGreggs.publishAccessory();

