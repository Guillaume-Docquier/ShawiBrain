'use strict';

let Wit = null;
let interactive = null;
Wit = require('node-wit').Wit;
interactive = require('node-wit').interactive;	

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
    var eventType = firstEntityValue(entities, 'eventType');
    var time = firstEntityValue(entities, 'timestamp');

    if (time) {
      // parse the time variable to get the time.
     
    } else {
      // we can use the time of the server.
    }

    if (eventType) {
      // Build database request with eventType & time. 
   
    } else {
      // Build database request with time only. 
    }

    // Send database request
    console.log(entities);
    return context;
  },

  findEventsTime({context, entities}){
    var eventType = firstEntityValue(entities, 'eventType');
    var location = firstEntityValue(entities, 'timestamp');

    if(eventType && location){
        //Build request with (location & eventype) and search for time
    }
    else if(eventType){
        //Build request with (eventype) and search for time
    }
    else if(location)
    {
        //Build request with (location) and search for time
    }
    else
    {
      //context.missingInfo;
    }
    console.log(entities);
    return context;
  },

  findEventsLocation({context, entities}){
    var eventType = firstEntityValue(entities, 'eventType');
    var time = firstEntityValue(entities, 'timestamp');
    var time 

    if (time) {
      // parse the time variable to get the time.
     
    } else {
      // we can use the time of the server.
    }

    if (eventType) {
      // Build database request with (eventType & time) and search for location. 
   
    } else {
      // Build database request with time only and search for location. 
    }

    // Send database request
    console.log(entities);
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

const client = new Wit({accessToken, actions});

function sendRequestToWit(req){
	const sender = 1;/*ID sender*/

	// We retrieve the user's current session, or create one if it doesn't exist
	// This is needed for our bot to figure out the conversation history
	const sessionId = findOrCreateSession(sender);

	// We retrieve the message content
	const text = "Qu'est-ce qui ce passe aujourdhui ?";

	if (text) {
		// We received a text message

		// Let's forward the message to the Wit.ai Bot Engine
		// This will run all actions until our bot has nothing left to do
		wit.runActions(
		  sessionId, // the user's current session
		  text, // the user's message
		  sessions[sessionId].context // the user's current session state
		).then((context) => {
		  // Our bot did everything it has to do.
		  // Now it's waiting for further messages to proceed.
		  console.log('Waiting for next user messages');

		  // Based on the session state, you might want to reset the session.
		  // This depends heavily on the business logic of your bot.
		  // Example:
		  // if (context['done']) {
		  //   delete sessions[sessionId];
		  // }

		  // Updating the user's current session state
		  sessions[sessionId].context = context;
		})
		.catch((err) => {
		  console.error('Oops! Got an error from Wit: ', err.stack || err);
		})
	}
}