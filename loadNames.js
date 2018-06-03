var obj  = require('./6whs.json');
//var obj = require('./better6whs.json');
var url = require('url');
var http = require('http');
var sizeOf = require('image-size');
var sqlite3 = require("sqlite3").verbose();
var fs = require("fs");
var entries = 0;
var dbFileName = "PhotoQ.db";
var db = new sqlite3.Database(dbFileName);
var location = '';
var list = '';
http.globalAgent.maxSockets = 1;
var len = obj.photoURLs.length;
var i = 0;
var height = 0;
var width = 0;
var index;

var createCmd = "CREATE TABLE photoTags (_IDX INTEGER UNIQUE NOT NULL PRIMARY KEY, _FILENAME TEXT, _WIDTH INTEGER, _HEIGHT INTEGER, _LOC TEXT, _LIST TEXT)";
var dropCmd = "DROP TABLE photoTags";

var cmdStr = 'INSERT INTO photoTags VALUES(_IDX, "_FILENAME", _WIDTH, _HEIGHT, "_LOC", "_LIST")';
var cbCount = 0;

var callback_count = 0;
var imgBuffs = [];

function main() {
  

  for(var i = 0; i < obj.photoURLs.length; i++) {
    console.log("Retrieving: Image " + i);
    var photoURL = obj.photoURLs[i];
    var options = url.parse(photoURL);
    http.get(options, function(res){
      var chunks = [];
      res.on('data', function(chunk) {
        chunks.push(chunk);
      }).on('end', function() {
        var buffer = Buffer.concat(chunks);
        imgBuffs.push(buffer);
        callback_count++;
        console.log(callback_count + " images retrieved");
        if(callback_count == obj.photoURLs.length)
          loadToTable();
      });
    });
  }
}

// Always use the callback for database operations and print out any
// error messages you get.
function tableCreationCallback(err) {
    if (err) {
  console.log("Table creation error",err);
    } else {
  console.log("Database created");
  db.close();
    }
}
/*
for(i; i < len; i++){
var firstPhoto = obj.photoURLs[i];
var options = url.parse(firstPhoto);


http.get(options, function (response) {
  var chunks = [];
  response.on('data', function (chunk) {
    chunks.push(chunk);
  }).on('end', function() {
    var buffer = Buffer.concat(chunks);
  console.log(i);
	saveTable(i, dbFileName, sizeOf(buffer).height, sizeOf(buffer).width, location, list);

});
});


}
*/
//dumpDB();

function loadToTable() {
  for(var i = 0; i < imgBuffs.length; i++) {
    console.log("Writing image " + i + " to table.");
    saveTable(i, obj.photoURLs[i], sizeOf(imgBuffs[i]).height, sizeOf(imgBuffs[i]).width, location, list);
  }
}


function insertDataCallback(err) {
        if(err){
                console.log("Error while saving data in DB: ", err);
        }

        cbCount += 1;
        if(cbCount == len) db.close();


}

function saveTable(index, name, height, width, location, list){
        var cmd = cmdStr.replace("_IDX", index);
        cmd = cmd.replace("_FILENAME", name);
        cmd = cmd.replace("_WIDTH", width);
        cmd = cmd.replace("_HEIGHT", height);
        cmd = cmd.replace("_LOC", location);
        cmd = cmd.replace("_LIST", list);
        console.log("        item", index, "complete!");
        db.run(cmd, insertDataCallback);

}



function dumpDB() {
  db.all ( 'SELECT * FROM photoTags', dataCallback);
      function dataCallback( err, data ) {
		console.log(data) 
      }
}

// Recreate a table
  db.run(dropCmd,function(err){
    if(!err) {
      db.run(createCmd, function(err) {
        if(!err)
          main();
        else
          console.log(err);
      });
    } else {
      console.log(err);
    }
  });
