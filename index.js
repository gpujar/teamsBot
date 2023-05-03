var express = require('express')
var app = express()
const bodyParser = require('body-parser');
//Dialogflow
const dialogflow = require('@google-cloud/dialogflow');
require('dotenv').config();

// Comment
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
// Your google dialogflow project-id
const PROJECID = CREDENTIALS.project_id;
// Configuration for the client
const CONFIGURATION = {
  credentials: {
      private_key: CREDENTIALS['private_key'],
      client_email: CREDENTIALS['client_email']
  }
}

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json());


app.get('/pva', function(request, response) {
  response.send('Hello World!');
  console.log("GET request ");
  console.log(request.body);
})

app.post('/pva', function(request, response) {
  response.send('Hello World!');
  console.log("POST request ");
  console.log(request.body);
  detectIntent('en', request.body.text, '1234abcd0987zyxw');
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

// Create a new session
const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);

// Detect intent method
const detectIntent = async (languageCode, queryText, sessionId) => {

    let sessionPath = sessionClient.projectAgentSessionPath(PROJECID, sessionId);

    // The text query request.
    let request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: queryText,
                // The language used by the client (en-US)
                languageCode: languageCode,
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log(responses);
    const result = responses[0].queryResult;
    console.log(result);

    return {
        response: result.fulfillmentText
    };
}