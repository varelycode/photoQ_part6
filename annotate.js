// Node module for working with a request to an API or other fellow-server
var APIrequest = require('request');
var fs = require("fs");
var http = require('http');
var filename = "frog.jpg";
var rl = require('url');
// An object containing the data the CCV API wants
// Will get stringified and put into the body of an HTTP request, below
// URL containing the API key 
// You'll have to fill in the one you got from Google
url = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyA8y7gMTZREnyyjeT1Gn0zrwog5f_HU3EI';
var obj  = require('./6whs.json');
//var obj = require('./better6whs.json');

var http = require('http');
var sizeOf = require('image-size');
var sqlite3 = require("sqlite3").verbose();
var entries = 0;
var dbFileName = "PhotoQ.db";
var db = new sqlite3.Database(dbFileName);
var location = '';
var list = '';
http.globalAgent.maxSockets = 1;
var i = 0;
var height = 0;
var width = 0;
var index;



main();
function main(){

for(var i = 0; i  < obj.photoURLs.length; i++) {
    var filename = obj.photoURLs[i];
	console.log(filename);
    var options = rl.parse(filename);
var imageString = filename;
console.log("i");
console.log(i);
annotateImage(filename, i);


}

}



function annotateImage(imageString, index) {
	// The code that makes a request to the API
	// Uses the Node request module, which packs up and sends off 
	// an HTTP message containing the request to the API server


console.log(index);
console.log("index");

APIrequestObject = {
  "requests": [
    {
      "image": {
        "source": {"imageUri": ""+imageString+""
	}
         },
      "features": [{ "type": "LABEL_DETECTION", "maxResults":6},{ "type": "LANDMARK_DETECTION", "maxResults":1}]
    }
  ]
}


	APIrequest(
	    { // HTTP header stuff
		url: url,
		method: "POST",
		headers: {"content-type": "application/json"},
		// will turn the given object into JSON
		json: APIrequestObject
	    },
	    // callback function for API request
	    APIcallback
	);


	// callback function, called when data is received from API
	function APIcallback(err, APIresponse, body) {
    	    if ((err) || (APIresponse.statusCode != 200)) {
		console.log("Got API error");
		console.log(body);
    	    } else {
		APIresponseJSON = body.responses[0];
		console.log(APIresponseJSON);

		var list = [];

//		if(APIresponseJSON.labelAnnotations){
		var length = APIresponseJSON.labelAnnotations.length;
		for(var t = 0; t < length; t++){
//		if(APIresponseJSON.labelAnnotations[t].description){
		list.push(APIresponseJSON.labelAnnotations[t].description);
		}

//			}
		list.toString();
		 var cmdStr = "UPDATE photoTags SET _LIST= '"+ list +"' WHERE _IDX = '"+ index +"'  ";
                 db.run(cmdStr); 

//		}
		if(!(APIresponseJSON.landmarkAnnotations)){
			console.log("No Landmark Information");
			var cmdStr = "UPDATE photoTags SET _LOC= 'No Landmark'";
                                db.run(cmdStr);


		}
		else {
			//console.log(APIresponseJSON.landmarkAnnotations[0].locations);
				var cmdStr = "UPDATE photoTags SET _LOC= '"+ APIresponseJSON.landmarkAnnotations[0].description+"' WHERE _IDX = '"+ index +"' ";
				db.run(cmdStr);	
			}
		}

    	} // end callback function

} // end annotateImage


// Do it! 
