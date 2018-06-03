// "Hello world" server

// like include
var http  = require('http');
var static = require('node-static');
var url = require('url');
var fs = require('fs');
var sqlite3 = require("sqlite3").verbose();

var file = new static.Server('./public');
var server = null;
var db = new sqlite3.Database("PhotoQ.db");

// like a callback
function handler (request, response) {
    var URL = request.url;

    var pathname = url.parse(request.url).pathname;

    console.log("New request " + URL + " from " + request.connection.remoteAddress);

    // request query
    if(/^\/query/.test(pathname)) {
    	URL = URL.replace("/","");

        var numList = URL.split('?')[1].split('=')[1].replace(/\+/g, ',');

        console.log("requesting: " + numList);
        
        // get all matched rows by index (_IDX)
        db.all("select " + "*" + " from photoTags where _IDX in(" + numList + ")", function(err, res) {
            if(!err) {
                console.log(JSON.stringify(res));
                objList = [];
                for(var i = 0; i < res.length; i++) {
                    // create a object
                    var obj = {};
                    obj.fileName = res[i]._FILENAME;
                    obj.width = res[i]._WIDTH;
                    obj.height = res[i]._HEIGHT;
                    objList.push(obj);
                }
                // respond with a list of objects
                response.writeHead(400, {"Content-Type": "text/plain"});
                response.write(JSON.stringify(objList));
                response.end();
            } else {
                console.log(err);
                response.writeHead(400, {"Content-Type": "text/plain"});
                response.write("{}");
                response.end();
            }
        });
    }
    // show files in /public
    else {
        console.log("Request file: " + pathname);
        fs.exists("./public" + pathname, function (exist) {
            if(exist && pathname != "/") {
    	        file.serve(request, response);
                console.log("File ./public" + pathname + "served.");
            }

            else {
                response.writeHead(404, {"Content-Type": "text/html"});
                var data = fs.readFileSync("not-found.html","utf-8");
                response.write(data.toString());
                //response.write("<p>404 PAGE NOT FOUND.<p>");
                response.end();
                console.log("File ./public" + pathname + " not found.");
            }
        });
    }
}

var server = http.createServer(handler);

// fill in YOUR port number!
server.listen(57387);
console.log("Listening port: 59462");

