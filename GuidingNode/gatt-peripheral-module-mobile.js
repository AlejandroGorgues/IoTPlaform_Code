var bleno = require('bleno');
var fs = require('fs');

const uuid = "69d9fdd724fa4987aa3f43b5f4cabcbf"; // set your own value
const name = "node"

const INITIALLOT_UUID = "69d9fdd734fa4987aa3f43b5f4cabcbf";
const FINALLOT_UUID = "69d9fdd744fa4987aa3f43b5f4cabcbf";
const ROUTE_UUID = "69d9fdd754fa4987aa3f43b5f4cabcbf";

var jKstra = require('jkstra');

var graph = new jKstra.Graph();

var n = []; // to easily keep references to the node objects



//Create vertex of the graph
n.push(graph.addVertex('1-1'));0
n.push(graph.addVertex('1-2'));1
n.push(graph.addVertex('1-3'));2
n.push(graph.addVertex('1-4'));3
n.push(graph.addVertex('2-1'));4 
n.push(graph.addVertex('2-2'));5
n.push(graph.addVertex('2-3'));6
n.push(graph.addVertex('2-4'));7
n.push(graph.addVertex('3-1'));8
n.push(graph.addVertex('3-2'));9
n.push(graph.addVertex('3-3'));10
n.push(graph.addVertex('3-4'));11
n.push(graph.addVertex('4-1'));12
n.push(graph.addVertex('4-2'));13
n.push(graph.addVertex('4-3'));14
n.push(graph.addVertex('4-4'));15


//Create edges of the graph
graph.addEdge(n[0], n[4], 1);
graph.addEdge(n[0], n[1], 1);   
graph.addEdge(n[4], n[5], 1);
graph.addEdge(n[4], n[0], 1);
graph.addEdge(n[4], n[8], 1);
graph.addEdge(n[1], n[0], 1);
graph.addEdge(n[1], n[5], 1);
graph.addEdge(n[1], n[2], 1);
graph.addEdge(n[5], n[4], 1);
graph.addEdge(n[5], n[1], 1);
graph.addEdge(n[5], n[6], 1);
graph.addEdge(n[2], n[1], 1);
graph.addEdge(n[2], n[6], 1);
graph.addEdge(n[2], n[3], 1);
graph.addEdge(n[3], n[2], 1);
graph.addEdge(n[3], n[7], 1);
graph.addEdge(n[6], n[5], 1);
graph.addEdge(n[6], n[2], 1);
graph.addEdge(n[6], n[7], 1);
graph.addEdge(n[7], n[6], 1);
graph.addEdge(n[7], n[3], 1);
graph.addEdge(n[7], n[11], 1);
graph.addEdge(n[8], n[9], 1);
graph.addEdge(n[8], n[12], 1);
graph.addEdge(n[8], n[4], 1);
graph.addEdge(n[12], n[13], 1);
graph.addEdge(n[12], n[8], 1);
graph.addEdge(n[9], n[8], 1);
graph.addEdge(n[9], n[13], 1);
graph.addEdge(n[9], n[10], 1);
graph.addEdge(n[13], n[14], 1);
graph.addEdge(n[13], n[9], 1);
graph.addEdge(n[13], n[12], 1);
graph.addEdge(n[10], n[9], 1);
graph.addEdge(n[10], n[14], 1);
graph.addEdge(n[10], n[11], 1);
graph.addEdge(n[14], n[10], 1);
graph.addEdge(n[14], n[15], 1);
graph.addEdge(n[14], n[13], 1);
graph.addEdge(n[11], n[15], 1);
graph.addEdge(n[11], n[10], 1);
graph.addEdge(n[11], n[7], 1);
graph.addEdge(n[15], n[14], 1);
graph.addEdge(n[15], n[11], 1);

var dijkstra = new jKstra.algos.Dijkstra(graph);


function calculatePath(n, nodo_inicialN, nodo_finalN, dijkstra){
// computes the shortestPath between nodo_inicialN and nodo_finalN,
    var Ipath = [];
    var resultList = [];
    var nodo_inicialS = nodo_inicialN[0].toString() + "-" + nodo_inicialN[1].toString();
    var nodo_finalS = nodo_finalN[0].toString() + "-" + nodo_finalN[1].toString();

    n.forEach(function (arrayItem) {
        if(arrayItem.data == nodo_inicialS){
            
            nodo_inicialS = arrayItem;
            
            return true;
        }
    });

    n.forEach(function (arrayItem) {
        if(arrayItem.data == nodo_finalS){
            nodo_finalS = arrayItem;
            return true;
        }
    });

    var path = dijkstra.shortestPath(nodo_inicialS, nodo_finalS, {
        edgeCost: function(e) { return e.data; }
    });

    path.forEach(function (arrItem) {
        var x = arrItem.from.data;
        var y = arrItem.to.data;
        resultList.push(x);
        resultList.push(y);
    });

    var uniqueArray = resultList.filter(function(item, pos) {
        return resultList.indexOf(item) == pos;
    })
    

    uniqueArray.forEach(function (arrItem) {
        Ipath.push([Number(arrItem.substring(0,1)),Number(arrItem.substring(2,3))]) ;
    });

    return Ipath;
}

/*
*Obtain the direction that the vehicle must take
*/
function calculateDirections(valuesPath, orientation){
    
    var result = "";

    /*
    * Based on the position of each node and i'ts neighbours
    * it returns the path that must follow (R for straight, D for Right, I for Left)
    */
    for (var i = 0; i < Object.keys(valuesPath).length-1; i++){
        var x = valuesPath[i+1][0] - valuesPath[i][0];
        var y = valuesPath[i+1][1] - valuesPath[i][1];
        //The initial comes from north
        if(orientation == "N"){
            
            if(x == 0 && y > 0){
                result = result + "R";

            }else if(x == 0 && y < 0){
                result = result + "R";
      
            }else if(x < 0 && y == 0){
                result = result + "D";
   
            }else if(x > 0 && y == 0){
                result = result + "I";
            }
        //The initial comes from south
        }else if(orientation == "S"){
 
            if(x == 0 && y > 0){
                result = result + "R";

            }else if(x == 0 && y < 0){
                result = result + "R";
      
            }else if(x < 0 && y == 0){
                result = result + "I";
 
            }else if(x > 0 && y == 0){
                result = result + "D";
            }
        //The initial comes from west
        }else if(orientation == "W"){

            if(x == 0 && y > 0){
                result = result + "I";

            }else if(x == 0 && y < 0){
                result = result + "D";
     
            }else if(x < 0 && y == 0){
                result = result + "R";
 
            }else if(x > 0 && y == 0){
                result = result + "R";
            }
        //The initial comes from east
        }else{
 
            if(x == 0 && y > 0){
                result = result + "D";

            }else if(x == 0 && y < 0){
                result = result + "I";
     
            }else if(x < 0 && y == 0){
                result = result + "R";
  
            }else if(x > 0 && y == 0){
                result = result + "R";
            }
        }
        
    }
    return result;
}

/*
 * Obtain the direction and check the closest initial device
 */

function obtainDistance(nodo_inicialT, nodo_finalT, dijkstra, n){
	var directions = "";
	var orientationResult = "";
	
	var nodo_inicialN = [Number(nodo_inicialT.substring(0,1)),Number(nodo_inicialT.substring(2,3))];
	var nodo_finalN = [Number(nodo_finalT.substring(0,1)),Number(nodo_finalT.substring(2,3))];
	/*
	* Check if the vehicle entered from x axis or y axis
	*/

	if (nodo_inicialN[0] == 1 || nodo_inicialN[0] == 4){

		if(nodo_inicialN[0] == 1){
			orientation = "W";
		}else{
			orientation = "E";
		}
		/*
		*Check if the initial sensor that the vehicle detected comes from the same side where the final sensor is,
		*otherwise, it adapt to make it possible without chaning the route
		*/
		if ((nodo_inicialN[0] > 2 && nodo_finalN[0] > 2) ||  (nodo_inicialN[0] <=2 && nodo_finalN[0] <= 2)){
			directions = calculateDirections(calculatePath(n, nodo_inicialN, nodo_finalN, dijkstra), orientation);
		}else if(nodo_inicialN[0] > 2 && nodo_finalN[0] <= 2  ){
			nodo_inicialN[1] = nodo_inicialN[1]-1;
			directions = calculateDirections(calculatePath(n, nodo_inicialN, nodo_finalN, dijkstra), orientation);
		}else if (nodo_inicialN[0] <= 2 && nodo_finalN[0] > 2){
			nodo_inicialN[1] = nodo_inicialN[1]+1;
			
			directions = calculateDirections(calculatePath(n, nodo_inicialN, nodo_finalN, dijkstra), orientation);
		}

	}else if (nodo_inicialN[0] != 1 && nodo_inicialN[0] != 4){

		if(nodo_inicialN[1] == 1 || nodo_inicialN[1] == 4){
			if(nodo_inicialN[1] == 1){
				orientation = "S";
			}else{
				orientation = "N";
			}
        /*
        *Check if the initial sensor that the vehicle detected comes from the same side where the final sensor is,
        *otherwise, it adapt to make it possible without chaning the route
        */
			if ((nodo_inicialN[1] > 2 && nodo_finalN[1] > 2) ||  (nodo_inicialN[1] <=2 && nodo_finalN[1] <= 2)){
				directions = calculateDirections(calculatePath(n, nodo_inicialN, nodo_finalN, dijkstra), orientation);
			}else if(nodo_inicialN[1] > 2 && nodo_finalN[1] <= 2 ){
				nodo_inicialN[0] = nodo_inicialN[0]-1;
				directions = calculateDirections(calculatePath(n, nodo_inicialN, nodo_finalN, dijkstra), orientation);
			}else if(nodo_inicialN[1] <= 2 && nodo_finalN[1] > 2){
				nodo_inicialN[0] = nodo_inicialN[0]+ 1;
				directions = calculateDirections(calculatePath(n, nodo_inicialN, nodo_finalN, dijkstra), orientation);
			}
		}else if ((nodo_inicialN[0] != 1 && nodo_inicialN[0] != 4) && (nodo_inicialN[1] != 1 && nodo_inicialN[1] != 4)){
		/*
		*Error
		*/
			console.log("Formato erróneo");
		}
	}

//After obtaining the route, it sends a message to activate the led
	fs.writeFile('activateLed.txt', '1', function (err) {
		if (err) throw err;
		console.log('Saved!');
	}); 
    //If the path is empty, it means the initial sensor is the final
	if(directions == ""){
	    return "P";
	}else{
	    return directions;
	}
	
}

/*
* Create the characteristic to store the route result
*/
class RouteCharacteristic extends bleno.Characteristic {
    constructor(routeFunc) {
        super({
            uuid: ROUTE_UUID,
            properties: ["read"],
            value: null,
            descriptors: [
                new bleno.Descriptor({
                    uuid: "2901",
                    value: "Direction result"
                  })
            ]
            
        });
        this.routeFunc = routeFunc;
    }
    
    onReadRequest(offset, callback) {
        try{
			const result = this.routeFunc();
			console.log(`Returning result: ${result}`);
			
			let data = Buffer.from(result, 'utf8');
			callback(this.RESULT_SUCCESS, data);
			
		}catch (err) {
			console.error(err);
			callback(this.RESULT_UNLIKELY_ERROR);
		}
    }
}

/*
* Create the  writeable characteristic to obtain the initial and final sensor
*/
class LocationCharacteristic extends bleno.Characteristic {
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
		console.log(data.length);
        try{
			if(data.length != 3){
				callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
				return;
			}
			console.log(data.toString('utf8'));
			this.argument = data.toString('utf8');
			console.log(`Argument ${this.name} is now ${this.argument}`);
			callback(this.RESULT_SUCCESS);
			
		}catch (err) {
			console.error(err);
			callback(this.RESULT_UNLIKELY_ERROR);
		}
    }
}


bleno.on("advertisingStart", err => {

    console.log("Configuring services...");
    
    if(err) {
        console.error(err);
        return;
    }

    let initialLot = new LocationCharacteristic(INITIALLOT_UUID, "Initial");
    let finalLot = new LocationCharacteristic(FINALLOT_UUID, "Final");
    let route = new RouteCharacteristic(() => obtainDistance(initialLot.argument, finalLot.argument, dijkstra, n));

    let parkingLot = new bleno.PrimaryService({
        uuid: uuid,
        characteristics: [
            initialLot,
            finalLot,
            route    
        ]
    });

    bleno.setServices([parkingLot], err => {
        if(err)
            console.log(err);
        else
            console.log("Services configured");
    });
});


console.log("Starting bleno...");

bleno.on("stateChange", state => {

    if (state === 'poweredOn') {
        console.log("Starting broadcast...");

		bleno.startAdvertising(name, [uuid], err => {
            if(err) {
                console.error(err);
            } else {
                console.log(`Broadcasting as iBeacon uuid:${uuid}`);
            }
        });
    } else {
        console.log("Stopping broadcast...");
        bleno.stopAdvertising();
    }        
});
