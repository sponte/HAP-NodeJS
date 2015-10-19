var fs = require('fs');
var path = require('path');
var storage = require('node-persist');
var uuid = require('./').uuid;
var Bridge = require('./').Bridge;
var Accessory = require('./').Accessory;
var accessoryLoader = require('./lib/AccessoryLoader');
var service_Factor = require('./').Service;

var accessoriesJSON = []

//accessoriesJSON.push(require("./accessories/types.js").accessory);
// Get user defined accessories from the accessories folder
// - user defined accessory filenames must end with "_accessory.js"
fs.readdirSync(path.join(__dirname, "accessories")).forEach(function(file) {
	if (file.split('_').pop()==="accessory.js") {
		//accessoriesJSON.push(require("./accessories/" + file).accessory);
	}
    else if (file.split('_').pop()==="accessories.js") {
        var accessoriesLoader = require("./accessories/" + file)(function(accessories) {
					for(var i=0;i<accessories.length;i++) {
	        	bridge.addBridgedAccessory(accessoryLoader.parseAccessoryJSON(accessories[i]));
	        }
				});

				if(accessoriesLoader && accessoriesLoader.accessories.length > 0) {
	        var accessories = require("./accessories/" + file).accessories;
	        for(var i=0;i<accessories.length;i++) {
	            accessoriesJSON.push(accessories[i]);
	        }
				}
    };
});

console.log("HAP-NodeJS starting...");

// Initialize our storage system
storage.initSync();

// Start by creating our Bridge which will host all loaded Accessories
var bridge = new Bridge('Node Bridge', uuid.generate("Node Bridge"));

// Listen for bridge identification event
bridge.on('identify', function(paired, callback) {
  console.log("Node Bridge identify");

	// Audible bell
	process.stdout.write('\x07\x07\x07')
  callback(); // success
});

// Load up all accessories in the /accessories folder
var dir = path.join(__dirname, "accessories");
var accessories = accessoryLoader.loadDirectory(dir);

// Add them all to the bridge
accessories.forEach(function(accessory) {
  bridge.addBridgedAccessory(accessory);
});

//console.log(accessoriesJSON)
//loop through accessories
for (var i = 0; i < accessoriesJSON.length; i++) {
    bridge.addBridgedAccessory(accessoryLoader.parseAccessoryJSON(accessoriesJSON[i]));
};

// Publish the Bridge on the local network.
bridge.publish({
  username: "CC:22:3D:E3:CE:F3",
  port: 51826,
  pincode: "031-45-154",
  category: Accessory.Categories.OTHER
});
