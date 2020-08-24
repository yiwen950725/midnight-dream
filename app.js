const express = require("express");
var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

var bodyParser = require('body-parser');

//NODE.js USES THE RESOURCES FOLDER UNDER THE ROOT FOLDER FOR
//ANY FILE SOURCE BY DEFAULT
app.use(express.static('resources'));

//"__dirname" is the path at the current folder(because app.js is at the current folder)
//this line of code exports "__basedir" to global
// global.__basedir = __dirname;

// var favicon = require('serve-favicon');

// app.use(favicon(__dirname + '/resources/static/img/favicon-32x32.png'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const mongoURI = "your link";
var fs = require('fs');

app.get('/', (req, res) => res.sendFile(__dirname+'/views/index.html'))

app.get("/qwertyui", (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    MongoClient.connect(mongoURI, function (err, db) {
        if (err) throw err;
        var dbo = db.db("message");
        dbo.collection("message").find({}).toArray(function (err, result) {
            let render = []
            console.log("result"+result.length);
            for (var i = 0; i < result.length; i++) {
                render.push(result[i].email);
                render.push(result[i].message);
            }
            if (err) throw err;
            console.log("render   "+render);
            console.log(result[0].email);
            let pass = render;
            res.render("msg", { pass });
            
            db.close();
           
        });
    });


}


);



app.get('/', function (req, res) {
    let doc = fs.readFileSync('./views/index.html', "utf8");

    res.send(doc);
});

app.get('/success', function (req, res) {
    let doc = fs.readFileSync('./views/submitted.html', "utf8");

    res.send(doc);
});


app.get('/howthisworks', function (req, res) {
    let doc = fs.readFileSync('./views/howthisworks.html', "utf8");

    res.send(doc);
});



// //update info to the main list
app.post("/", (req, res) => {


    res.setHeader('Content-Type', 'application/json');
    MongoClient.connect(mongoURI, function (err, db) {
        if (err) throw err;
        var dbo = db.db("message");

        //set the targeted item to the new name
        dbo.collection("message").insertOne({
                "email": req.body.email,
                "message": req.body.message
            },


        )

    });

});



app.listen(process.env.PORT);