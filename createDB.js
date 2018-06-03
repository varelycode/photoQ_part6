// Globals
var sqlite3 = require("sqlite3").verbose();  // use sqlite
var fs = require("fs");

var dbFileName = "PhotoQ.db";
// makes the object that represents the database in our code
var db = new sqlite3.Database(dbFileName);

// Initialize table.
// If the table already exists, causes an error.
// Fix the error by removing or renaming PhotoQ.db
// a unique ID number (int)
// a photo filename strnig, width of phot int, height of photo int, a location tag string, a cs list of tags string
var cmdStr = "CREATE TABLE photoTags (_IDX INTEGER UNIQUE NOT NULL PRIMARY KEY, _FILENAME TEXT, _WIDTH INTEGER, _HEIGHT INTEGER, _LOC TEXT, _LIST TEXT)";
db.run(cmdStr,tableCreationCallback);

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
