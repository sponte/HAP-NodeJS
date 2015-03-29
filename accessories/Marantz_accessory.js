// HomeKit types required
var types = require("./types.js")
var exports = module.exports = {};

var sys = require('sys');
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) };

var execute = function(accessory,characteristic,value){ console.log("executed accessory: " + accessory + ", and characteristic: " + characteristic + ", with value: " +  value + ".");
    if(value==true) exec("osascript ./accessories/Marantz_power_on.scpt");
    else exec("osascript ./accessories/Marantz_power_off.scpt");
}

exports.accessory = {
displayName: "Plex Home Theater",
username: "1A:2B:3C:4D:5E:FF",
pincode: "031-45-154",
services: [{
           sType: types.ACCESSORY_INFORMATION_STYPE,
           characteristics: [{
                             cType: types.NAME_CTYPE,
                             onUpdate: null,
                             perms: ["pr"],
                             format: "string",
                             initialValue: "Receiver",
                             supportEvents: false,
                             supportBonjour: false,
                             manfDescription: "Bla",
                             designedMaxLength: 255
                             },{
                             cType: types.MANUFACTURER_CTYPE,
                             onUpdate: null,
                             perms: ["pr"],
                             format: "string",
                             initialValue: "Marantz",
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
                             initialValue: "A1S2NASF99EW",
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
           sType: types.SWITCH_STYPE,
           characteristics: [{
                             cType: types.NAME_CTYPE,
                             onUpdate: null,
                             perms: ["pr"],
                             format: "string",
                             initialValue: "Marantz Switch Service",
                             supportEvents: false,
                             supportBonjour: false,
                             manfDescription: "Bla",
                             designedMaxLength: 255
                             },{
                             cType: types.POWER_STATE_CTYPE,
                             onUpdate: function(value) { console.log("Change:",value); execute("Matrantz", "switch service", value); },
                             perms: ["pw","pr","ev"],
                             format: "bool",
                             initialValue: false,
                             supportEvents: false,
                             supportBonjour: false,
                             manfDescription: "Turn On Marantz Receiver",
                             designedMaxLength: 1    
                             }]
           }]
}