var async = require('async');
var noble = require('noble');
var fs = require('fs');
'use strict';


var parkingLotServiceUuid = '0001000089bd43c8923140f6e305f96d';
var stateUuid = '0001000189bd43c8923140f6e305f96d';
var advisorUuid = '0001000189bd44c8923140f6e305f96d';
var pastResult = 0;

function ParkingLot(idParkingLot, stateLot, idParking){
	this.idParkingLot = idParkingLot;
	this.stateLot = stateLot;
	this.idParking = idParking;
}

/*
* Sends state of the parking lot to the database in the cloud
*/
function sendMessage(result){
	var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
	var Message = require('azure-iot-device').Message;	
	var deviceConnectionString = '';
	var client = clientFromConnectionString(deviceConnectionString);
	var parkingLotArray = [];
  var resultMessage = "";
  var activateMessage = false;
  

  /*
  * Check if it has been any change on the parking lot 
  */
  if(result != 0 && pastResult == 0){
    pastResult = result;
    resultMessage = "blocked";
    activateMessage = true;
  }else if (result == 0 && pastResult != 0){
    pastResult = 0;
    resultMessage = "free";
    activateMessage = true;
  }
  
	var parkingLotIds = ["0C79A25E-0D1B-458F-9DB5-70CF91FC21FE"];
	function printResultFor(op) {
	  return function printResult(err, res) {
		if (err) console.log(op + ' error: ' + err.toString());
		if (res) console.log(op + ' status: ' + res.constructor.name);
	  };
	}
  

  /*
  * Create the callback function that will update the state of the parking lot on the cloud
  */
	var connectCallback = function (err) {
	  if (err) {
		console.log('Could not connect: ' + err);
	  } else {
		console.log('Client connected');
			parkingLotArray.push(new ParkingLot(parkingLotIds[0], resultMessage, "268FF33D-3DF4-49CB-AD72-549BB8FC6820"));
			           
			var data = JSON.stringify({ deviceId: 'dockerNodejsDevice', msg: parkingLotArray, date: new Date() });
			var message = new Message(data);			
			console.log("Sending message: " + message.getData());
			client.sendEvent(message, printResultFor('send'));
	  }
	};
  if(activateMessage){
    client.open(connectCallback);
    activateMessage = false;
  }
}



noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    //
    // Once the BLE radio has been powered on, it is possible
    // to begin scanning for services. Pass an empty array to
    // scan for all services (uses more time and power).
    //
    console.log('scanning...');
    noble.startScanning([parkingLotServiceUuid], false);
  }
  else {
    noble.stopScanning();
  }
})

var parkingLotService = null;
var stateCharacteristic = null;
var advisorCharacteristic = null;


noble.on('discover', function(peripheral) {
  // we found a peripheral, stop scanning
  noble.stopScanning();

  //
  // The advertisment data contains a name, power level (if available),
  // certain advertised service uuids, as well as manufacturer data,
  // which could be formatted as an iBeacon.
  //
  console.log('found peripheral:', peripheral.advertisement);
  //
  // Once the peripheral has been discovered, then connect to it.
  //
  peripheral.connect(function(err) {
    //
    // Once the peripheral has been connected, then discover the
    // services and characteristics of interest.
    //
    
    peripheral.discoverServices([parkingLotServiceUuid], function(err, services) {
      services.forEach(function(service) {
        //
        // This must be the service we were looking for.
        //
        console.log('found service:', service.uuid);

        //
        // So, discover its characteristics.
        //
        service.discoverCharacteristics([], function(err, characteristics) {

          characteristics.forEach(function(characteristic) {
            //
            // Loop through each characteristic and match them to the
            // UUIDs that we know about.
            //
            console.log('found characteristic:', characteristic.uuid);

            if (stateUuid == characteristic.uuid) {
              stateCharacteristic = characteristic;
            }else if (advisorUuid == characteristic.uuid){
              advisorCharacteristic = characteristic;
            }
          })

          //
          // Check to see if we found all of our characteristics.
          //
          if (stateCharacteristic && advisorCharacteristic) {
            //
            // Read data form the parking lot and update the led action
            //
            operate();
          }
          else {
            console.log('missing characteristics');
          }
        })
      })
    })
  })
})


function readActivation (callback){
  fs.readFile('activateLed.txt', function(err, data) {
      
      return callback(null, Number(data.toString()));
    });
}

function operate() {
  var data = null;
  var value = 0;
  
  stateCharacteristic.on('data', function(data, isNotification) {
    if (data.length === 2) {
      var result = data.readUInt8();
      console.log("result is: " + result);
      //Send message to the cloud
      sendMessage(result);

      readActivation( function readResponse(err, action){
        var advisorAction = new Buffer(1);
        advisorAction.writeUInt8(action, 0);
    
        advisorCharacteristic.write(advisorAction, false, function(err) {
        if (!err) {
        }
        });
      });
    }
    else {
      console.log('result length incorrect')
    }
  });
  stateCharacteristic.subscribe(function(err) {
  }); 
}
