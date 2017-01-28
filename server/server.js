// server.js taken from https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // Call express
var app        = express();                 // Define our app using express
var bodyParser = require('body-parser');    // Parse JSON
var request    = require('request');        // Send HTTP requests to get data
var fs         = require("fs");             // Read data files

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

//Home API, gives some info
router.get('/', function(req, res) {
    res.json({
        message: 'Welcome to our api!',
        structure:
        {
            url: 'api/test',
            type: 'POST',
            expects: 'key = message',
            returns: 'Your message in key = response'
        },
        {
            url: 'api/brain',
            type: 'GET',
            expects: 'nothing',
            returns: 'A greeting'
        },
        {
            url: 'api/brain',
            type: 'POST',
            expects: 'nothing, yet',
            returns: 'Nothing relevant, yet'
        }
    });
});

//Route for testing
//Returns the incoming message
router.post('/test', function(req, res) {
    console.log(req.body);
    res.json({ reponse: req.body.message });
});

//Route for brain requests
//Greets the user
router.get('/brain', function(req, res) {
    res.json({
        message: 'Welcome to Shawi Brain!',
    });
});

//Route for brain requests
//Thinks
router.post('/brain', function(req, res) {
    //Do something with req
    res.json({
        message: 'Brain is not ready!',
    });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
events = fs.readFileSync(__dirname + '/data/Événements_2017.geojson');

app.listen(port);
console.log('Magic happens on port ' + port);
