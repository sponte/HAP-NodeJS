// HomeKit types required
var types = require("./types.js")
var exports = module.exports = {};

// Exec sync
var execSync = require('exec-sync');

var lightwaveRFController_Factor = new require("./../LightwaveRFController.js")
var lightwaveRFController = new lightwaveRFController_Factor.LRFController(500);

var executePower = function(room,accessory,value){
    var cmd = "lightwaverf " + room + " " + accessory + " ";
    if(value == true) cmd += "on";
    else cmd += "off";
    console.log("executePower: " + cmd);
    
    lightwaveRFController.exec(cmd);
}

var executeBrightness = function(room,accessory,value){
    var cmd = "lightwaverf " + room + " " + accessory + " ";
    cmd += value;
    console.log("executeBrigtness: " + cmd);
    
    lightwaveRFController.exec(cmd);
}

console.log("Checking lightwaveRF configuration");

// Get the lightwaverf login details
// Note: The file lightwaverflogin.txt should be located in the directory above Core.js and contain two lines
//       The first line should be the loginname (=email)
//       The second should be the lightwaverf pin
fs = require('fs');
var data = fs.readFileSync('./../lightwaverflogin.txt', 'utf8')

if (data.err) {
    return console.log(data.err);
}
var lrfLoginPass = data.split("\n");
            
//if(!lrfLoginPass.isArray()) return;
if(!Array.isArray(lrfLoginPass) || lrfLoginPass.size<2) return console.log("lightwaverflogin.txt should contain two lines");
    
var lrfCMD = "lightwaverf update " + lrfLoginPass.at(0) + " " + lrfLoginPass.at(1);
var result = execSync(lrfCMD,true);

exports.accessories = [];
LRFCallback(result.error,result.stdout,result.stderr, exports.accessories);


// stdout should contain the configuration
function LRFCallback(error, stdout, stderr, accessories) {
    if(stdout) {
        var posFirstBracket = stdout.search("\\[");
        var startString = stdout.substr(posFirstBracket);
        if(startString == "") return console.log("LRFCallback:\n" + stdout);
        var rooms = stdout.split("]},");
        for(var i=0; i<rooms.length;i++) {
            var room = rooms[i];
            //console.log(room+"\n");
            
            // Find the room name
            var startRoomNameSearchStr = "\"name\"=>";
            var startRoomName = room.search(startRoomNameSearchStr) + startRoomNameSearchStr.length;
            var endRoomName = room.search(",");
            var roomName = room.substr( startRoomName, endRoomName - startRoomName);
            roomName = roomName.replace("\"",""); roomName = roomName.replace("\"","");
            //console.log("room = " + roomName);
            
            var startDevicesString = room.substr(room.search("\"device\"=>\\[") + 11);
            //console.log(startDevicesString);
            var devices = startDevicesString.split("}, ");
            for(var j=0; j<devices.length;j++) {
                var device = devices[j];
                // TODO clean this up (global doesn't work easily....)
                device = device.replace("{",""); device = device.replace("}","");
                device = device.replace("{",""); device = device.replace("}","");
                device = device.replace("{",""); device = device.replace("}","");
                device = device.replace("]",""); device = device.replace("]","");
                device = device.replace("\"",""); device = device.replace("\"","");
                device = device.replace("\"",""); device = device.replace("\"","");
                device = device.replace("\"",""); device = device.replace("\"","");
                device = device.replace("\"",""); device = device.replace("\"","");
                //console.log(device+"\n");
                
                var deviceName = "";
                var deviceType = "";
                
                var deviceNameAndType = device.split(",");
                for(var k=0; k<deviceNameAndType.length;k++) {
                    var tempArray = deviceNameAndType[k].split("=>");
                    if(tempArray[0].search("name")>=0) deviceName = tempArray[1];
                    if(tempArray[0].search("type")>=0) deviceType = tempArray[1];
                }
                
                //console.log("deviceName = " + deviceName + ", type = " + deviceType);
                

                // Finally... add the devices to homekit
                accessories.push(createAccessory(roomName, deviceName,deviceType));
            }
        }
    }
    
    // If there were errors
    if(error) return console.log("LRFCallback - Error while obtaining the lightwaverf configuration: " + error);
    if(stderr) return console.log("LRFCallback - returned the following errors: " + stderr);
}



function createAccessory(room, name,type) { // TODO take type into account
    var accessory = {
      displayName: name,
      username: "1A:2B:3C:4D:5E:FF",
      pincode: "031-45-154",
      services: [{
        sType: types.ACCESSORY_INFORMATION_STYPE, 
        characteristics: [{
            cType: types.NAME_CTYPE, 
            onUpdate: null,
            perms: ["pr"],
            format: "string",
            initialValue: name,
            supportEvents: false,
            supportBonjour: false,
            manfDescription: "Bla",
            designedMaxLength: 255    
        },{
            cType: types.MANUFACTURER_CTYPE, 
            onUpdate: null,
            perms: ["pr"],
            format: "string",
            initialValue: "Oltica",
            supportEvents: false,
            supportBonjour: false,
            manfDescription: "Bla",
            designedMaxLength: 255    
        },{
            cType: types.MODEL_CTYPE,
            onUpdate: null,
            perms: ["pr"],
            format: "string",
            initialValue: "Rev-1",
            supportEvents: false,
            supportBonjour: false,
            manfDescription: "Bla",
            designedMaxLength: 255    
        },{
            cType: types.SERIAL_NUMBER_CTYPE, 
            onUpdate: null,
            perms: ["pr"],
            format: "string",
            initialValue: "A1S2NASF88EW",
            supportEvents: false,
            supportBonjour: false,
            manfDescription: "Bla",
            designedMaxLength: 255    
        },{
            cType: types.IDENTIFY_CTYPE, 
            onUpdate: null,
            perms: ["pw"],
            format: "bool",
            initialValue: false,
            supportEvents: false,
            supportBonjour: false,
            manfDescription: "Identify Accessory",
            designedMaxLength: 1    
        }]
      },{
        sType: types.LIGHTBULB_STYPE, 
        characteristics: [{
            cType: types.NAME_CTYPE,
            onUpdate: null,
            perms: ["pr"],
            format: "string",
            initialValue: name + " Light Service",
            supportEvents: false,
            supportBonjour: false,
            manfDescription: "Bla",
            designedMaxLength: 255   
        },{
            cType: types.POWER_STATE_CTYPE,
            onUpdate: function(value) { console.log("Change:",value); executePower(room, name, value); },
            perms: ["pw","pr","ev"],
            format: "bool",
            initialValue: false,
            supportEvents: false,
            supportBonjour: false,
            manfDescription: "Turn On the Light",
            designedMaxLength: 1    
        },{
            cType: types.BRIGHTNESS_CTYPE,
            onUpdate: function(value) { console.log("Change:",value); executeBrightness(room, name, value); },
            perms: ["pw","pr","ev"],
            format: "int",
            initialValue: 0,
            supportEvents: false,
            supportBonjour: false,
            manfDescription: "Adjust Brightness of Light",
            designedMinValue: 0,
            designedMaxValue: 100,
            designedMinStep: 1,
            unit: "%"
          }]
      }]
    }

    return accessory
}
