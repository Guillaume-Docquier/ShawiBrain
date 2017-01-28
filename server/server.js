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

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

//Route for testing
router.post('/test', function(req, res) {
    console.log(req);
    res.json({ reponse: req.body.message });
});

//Route for events
router.get('/events', function(req, res) {
    res.json({
        message: 'hooray! welcome to our api!',
        structure:
        {
            url: 'api/test',
            type: 'POST',
            expects: 'key = message'
            returns: 'Your message in key = response'
        }
    });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
events = fs.readFileSync(__dirname + '/data/Événements_2017.geojson');
console.log("events: " + events);

app.listen(port);
console.log('Magic happens on port ' + port);
