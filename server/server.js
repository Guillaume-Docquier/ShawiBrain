// server.js taken from https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

// BASE SETUP
// =============================================================================

// call the packages we need
var express     = require('express');               // Call express
var app         = express();                        // Define our app using express
var bodyParser  = require('body-parser');           // Parse JSON
var request     = require('request');               // Send HTTP requests to get data
var fs          = require('fs');                    // Read data files
var wit         = require('node-wit').Wit;          // wit.ai

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// WIT.AI
// =============================================================================
const accessToken = "NELAEL4JFFZGGW3VLOZTKCQH3VVDTDOJ"

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};



const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    console.log('sending...', JSON.stringify(response));
  },

  findEvents({context, entities}){
    //Get info
    var eventType = firstEntityValue(entities, 'eventType');
    var time      = firstEntityValue(entities, 'datetime');
    var location  = firstEntityValue(entities, 'timestamp');

    //Logging
    console.log("eventType: " + eventType);
    console.log("time: " + time);
    console.log("location: " + location);
    console.log(entities);

    //Load storage variables
    lookupKeys = ["TYPE", "LIEU"];
    lookupArgs = [eventType, location];
    outputKey = outputKeys[firstEntityValue(entities, 'intent')];
    list = events;

    return context;
  }
};

const findOrCreateSession = (fbid) => {
  let sessionId;
  // Let's see if we already have a session for the user fbid
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // Yep, got it!
      sessionId = k;
    }
  });
  if (!sessionId) {
    // No session found for user fbid, let's create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {fbid: fbid, context: {}};
  }
  return sessionId;
};

//Entry point to wit
function sendRequestToWit(req){
	const sender = 1;/*ID sender*/

	// We retrieve the user's current session, or create one if it doesn't exist
	// This is needed for our bot to figure out the conversation history
	const sessionId = findOrCreateSession(sender);

	if (req) {
		// We received a text message

		// Let's forward the message to the Wit.ai Bot Engine
		// This will run all actions until our bot has nothing left to do
		client.runActions(
		  sessionId, // the user's current session
		  req, // the user's message
		  sessions[sessionId].context // the user's current session state
		).then((context) => {
          //Find your data
		  var data = findData();

          //Reset storage variables
          resetStorage();

          //Update session
		  sessions[sessionId].context = context;

          return data;
		})
		.catch((err) => {
		  console.error('Oops! Got an error from Wit: ', err.stack || err);
		})
	}
}

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

//Home API, gives some info
router.get('/', function(req, res) {
    res.json({
        message: 'Welcome to our api!',
        structure:
        [
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
        ]
    });
});

//Route for testing
//Returns the incoming message
router.post('/test', function(req, res)
{
    console.log("POST on /test: " + req.body);
    res.json({ reponse: req.body.message });
});

//Route for brain requests
//Greets the user
router.get('/brain', function(req, res)
{
    res.json({
        message: 'Welcome to Shawi Brain!',
    });
});

//Route for brain requests
//Thinks
router.post('/brain', function(req, res)
{
    //Do something with req
    console.log("POST on /brain: " + req.body);
    //var reponse = find(req.lookupKey, req.lookupArg, req.outputKey, events);
    var answer = sendRequestToWit(req.body.message);
    console.log(answer);
    res.json({
        message: answer
    });
});

// more routes for our API will happen here

// REGISTER ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// QUERIES
// =============================================================================
// Uses storage variables globally set by wit
// @lookupKeys
// @lookupArgs
// @outputKey
// @list
function findData()
{
    var results = [];
    for(var i = 0; i < list.length; i++)
    {
        var found = true;
        for(var j = 0; j < lookupKeys.length; j++)
        {
            if(lookupKeys[j] && lookupArgs[j] && list[i].properties[lookupKeys[j]].search(lookupArgs[j]) == -1)
            {
                found = false;
            }
        }
        if(found)
        {
            results.push(list[i].properties[outputKey]);
        }
    }
    console.log("Results: " + results);
    return results;
}

function resetStorage()
{
    var lookupKeys = null;
    var lookupArgs = null;
    var outputKey = null;
    var list = null;
}
//[]
// START THE SERVER
// =============================================================================

//Lookup variables
var outputKeys = {
    'eventLocationRequest': "LIEU",
    'eventRequest': "NOM",
    'eventTimeRequest': "DATE1"
}

//wit variables
const sessions = {};
const client = new wit({accessToken, actions});

//Storage variables
var lookupKeys = null;
var lookupArgs = null;
var outputKey = null;
var list = null;

//data
var events = JSON.parse(fs.readFileSync(__dirname + '/data/Événements_2017.geojson')).features;

//Go
app.listen(port);
console.log('Magic happens on port ' + port);
