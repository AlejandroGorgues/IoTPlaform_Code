var bleno = require('bleno');
var fs = require('fs'); 

const PARKING_LOT_SERVICE_UUID = "00010000-89BD-43C8-9231-40F6E305F96D";
const STATE_UUID = "00010001-89BD-43C8-9231-40F6E305F96D";
const ADVISOR_UUID = "00010001-89BD-44C8-9231-40F6E305F96D";

var stateLot = null;
var distance = 0;


//Read the distance obtained from the ultrasonic sensor on the txt file
function readDistance(callback){
     var testing = fs.readFile('sensorData.txt', function(err, data) {
        return callback(null, Number(data.toString()));
    });
    
}

/*
* Create the notify attribute that will make possible to read the state of the ultrasonic sensor
*/
class StateCharacteristic extends bleno.Characteristic {
    constructor(stateFunc) {
        super({
            uuid: STATE_UUID,
            properties: ["notify"],
            value: null,
            descriptors: [
                new bleno.Descriptor({
                    uuid: "2901",
                    value: "State result"
                  })
            ]
            
        });
        this.distance = 0;
        this.stateFunc = stateFunc;
    }
    
    onSubscribe(maxValueSize, updateValueCallback) {
        console.log(`Distance subscribed, max value size is ${maxValueSize}`);
        this.updateValueCallback = updateValueCallback;
    }
    
    onUnsuscribe(){
        console.log("Distance unsubscribe");
        this.updateValueCallback = null;
    }
    
    sendNotification(value){
        if(this.updateValueCallback){
            
            console.log(`Sending notification with value ${value}`);
            const notificationBytes = new Buffer(2);
            notificationBytes.writeInt16LE(value);
            
            this.updateValueCallback(notificationBytes);
        }
    }
    
    start() {
        //Read the file every 2 seconds
        console.log("Starting reading");
        var that = this
        this.handle = setInterval(() => {
            
            readDistance(function test(err, distanceAux) {
                
                distance = distanceAux;
                that.sendNotification(distance);
            });
            console.log("distancia: " + distance);
            
        }, 2000);
    }

    stop() {
        console.log("Stopping reading");
        clearInterval(this.handle);
        this.handle = null;
    }
}

/*
* Create the writeable characteristic to activate the led or not
*/
class AdvisorCharacteristic extends bleno.Characteristic {
    constructor(uuid, name) {
        super({
            uuid: uuid,
            properties: ["write"],
            value: null,
            descriptors: [
                new bleno.Descriptor({
                    uuid: "2901",
                    value: name
                  })
            ]
        });

        this.argument = 0;
        this.name = name;
    }

    onWriteRequest(data, offset, withoutResponse, callback) {
        try {
            if(data.length != 1) {
                callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
                return;
            }

            console.log(data.toString());
            this.argument = data.readUInt8();
            
            //If the car is in the parking, the guide node makes the lot light
            if(this.argument == 1){
                fs.writeFile('ledAction.txt', 'light', function (err) {
                    if (err) throw err;
                        console.log('Replaced!');
                });
            }else{
                fs.writeFile('ledAction.txt', '', function (err) {
                    if (err) throw err;
                        console.log('Replaced!');
                });
            }
            console.log(`Argument ${this.name} is now ${this.argument}`);
            callback(this.RESULT_SUCCESS);

        } catch (err) {
            console.error(err);
            callback(this.RESULT_UNLIKELY_ERROR);
        }
    }
}


console.log("Starting bleno...");

bleno.on("stateChange", state => {

    if (state === 'poweredOn') {
        console.log("Starting broadcast...");

        bleno.startAdvertising("1-2Signal", [PARKING_LOT_SERVICE_UUID], err => {
            if(err) {
                console.error(err);
            } else {
                console.log(`Broadcasting as iBeacon uuid:${PARKING_LOT_SERVICE_UUID}`);
            }
        });
    } else {
        console.log("Stopping broadcast...");
        bleno.stopAdvertising();
    }        
});

bleno.on("advertisingStart", err => {

    console.log("Configuring services...");
    
    if(err) {
        console.error(err);
        return;
    }
    let advisor = new AdvisorCharacteristic(ADVISOR_UUID, "Advisor");
    stateLot = new StateCharacteristic();
    stateLot.start();

    let parkingLot = new bleno.PrimaryService({
        uuid: PARKING_LOT_SERVICE_UUID,
        characteristics: [
            advisor,
            stateLot
        ]
    });

    bleno.setServices([parkingLot], err => {
        if(err)
            console.log(err);
        else
            console.log("Services configured");
    });
});
