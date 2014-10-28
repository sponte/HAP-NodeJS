var service_Factor = new require("./Service.js");
var characteristic_Factor = new require("./Characteristic.js");

//var sys = require('sys');
//var exec = require('child_process').exec;
//function puts(error, stdout, stderr) { sys.puts(stdout) };


module.exports = {
  generateLightService: function (lightwaveRFController) {
	var lightService = new service_Factor.Service("00000043-0000-1000-8000-0026BB765291");

	var nameOptions = {
		type: "00000023-0000-1000-8000-0026BB765291",
		perms: [
			"pr"
		],
		format: "string",
		initialValue: "Funnel",
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Bla",
		designedMaxLength: 255,
	}
	var nameChar = new characteristic_Factor.Characteristic(nameOptions);
	lightService.addCharacteristic(nameChar);

	var onOptions = {
		type: "00000025-0000-1000-8000-0026BB765291",
		perms: [
			"pw",
			"pr",
			"ev"
		],
		format: "bool",
		initialValue: false,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Turn On the Light",
		designedMaxLength: 1,
	}
	var lightSwitchChar = new characteristic_Factor.Characteristic(onOptions, function(value) {
		console.log("Light Status Change:",value);

                var lightcmd = "lightwaverf Woonkamer Funnel ";
                if(value) lightcmd = lightcmd + "on";
                else lightcmd = lightcmd + "off";
                console.log(lightcmd);
                //exec(lightcmd);
                lightwaveRFController.exec(lightcmd, function() {
                        console.log('Command sent');
                });
	});
	lightService.addCharacteristic(lightSwitchChar);

	return lightService;
  },
  generateAccessoryInfoService: function (name, model, sn, manufacturer) {
	var infoService = new service_Factor.Service("0000003E-0000-1000-8000-0026BB765291");

	var nameOptions = {
		type: "00000023-0000-1000-8000-0026BB765291",
		perms: [
			"pr"
		],
		format: "string",
		initialValue: name,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Bla",
		designedMaxLength: 255,
	}
	var nameChar = new characteristic_Factor.Characteristic(nameOptions);
	infoService.addCharacteristic(nameChar);

	var manufacturerOptions = {
		type: "00000020-0000-1000-8000-0026BB765291",
		perms: [
			"pr"
		],
		format: "string",
		initialValue: manufacturer,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Bla",
		designedMaxLength: 255,
	}
	var manufacturerChar = new characteristic_Factor.Characteristic(manufacturerOptions);
	infoService.addCharacteristic(manufacturerChar);

	var modelOptions = {
		type: "00000021-0000-1000-8000-0026BB765291",
		perms: [
			"pr"
		],
		format: "string",
		initialValue: model,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Bla",
		designedMaxLength: 255,
	}
	var modelChar = new characteristic_Factor.Characteristic(modelOptions);
	infoService.addCharacteristic(modelChar);

	var snOptions = {
		type: "00000030-0000-1000-8000-0026BB765291",
		perms: [
			"pr"
		],
		format: "string",
		initialValue: sn,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Bla",
		designedMaxLength: 255,
	}
	var snChar = new characteristic_Factor.Characteristic(snOptions);
	infoService.addCharacteristic(snChar);

	var identifyOptions = {
		type: "00000014-0000-1000-8000-0026BB765291",
		perms: [
			"pw"
		],
		format: "bool",
		initialValue: false,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Identify Accessory",
		designedMaxLength: 1,
	}
	var identifyChar = new characteristic_Factor.Characteristic(identifyOptions);
	infoService.addCharacteristic(identifyChar);

	return infoService;
  }
};

