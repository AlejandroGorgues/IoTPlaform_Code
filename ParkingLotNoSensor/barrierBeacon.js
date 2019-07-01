const bleno = require("bleno");

const BARRIER_UUID = "69d9fdd724fa4876aa3f45b5f4cabcbf"; // set your own value
const name = "2-1"

console.log("Starting bleno...");

bleno.on("stateChange", state => {

    if (state === 'poweredOn') {
        console.log("Starting broadcast...");

        bleno.startAdvertising(name, [BARRIER_UUID], err => {
            if(err) {
                console.error(err);
            } else {
                console.log(`Broadcasting as iBeacon uuid:${BARRIER_UUID}`);
            }
        });
    } else {
        console.log("Stopping broadcast...");
        bleno.stopAdvertising();
    }        
});
