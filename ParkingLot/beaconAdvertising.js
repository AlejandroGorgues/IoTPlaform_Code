var bleno = require('bleno');
var fs = require('fs'); 

const PARKING_LOT_SERVICE_UUID = "00010000-90BD-43C8-4231-41F6E305C96D";

var stateLot = null;
var distance = 0;


/*
* Create an empty beacon in order to get recognized by the mobile phone
*/
console.log("Starting bleno...");

bleno.on("stateChange", state => {

    if (state === 'poweredOn') {
        console.log("Starting broadcast...");

        bleno.startAdvertising("1-2", [PARKING_LOT_SERVICE_UUID], err => {
            if(err) {
                console.error(err);
            } else {
                console.log(`Broadcasting as iBeacon uuid:${PARKING_LOT_SERVICE_UUID}`);
            }
        });
    } else {
        console.log("Stopping broadcast...");
    }        
});

bleno.on("advertisingStart", err => {

    console.log("Configuring services...");
    
    if(err) {
        console.error(err);
        return;
    }


    let parkingLot = new bleno.PrimaryService({
        uuid: PARKING_LOT_SERVICE_UUID,
        characteristics: [
        ]
    });

    bleno.setServices([parkingLot], err => {
        if(err)
            console.log(err);
        else
            console.log("Services configured");
    });
});
