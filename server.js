var fs = require('fs');
var data = [];
var intentHandlers = [];
var serverRoutines = [];

function loadDataFiles(userId, sendMessageCallback){
	console.log('### loading data files');
	data = [];
	var dataFiles = fs.readdirSync('./data_files');
	for(dataFile of dataFiles){
		console.log('### loading: ' + './data_files/' + dataFile);
		var dataObject = require('./data_files/' + dataFile);
		data[dataFile.substring(0, dataFile.indexOf('.json'))] = dataObject;
	}
	
	if(sendMessageCallback) sendMessageCallback(userId, {text: 'done'});
	return;
}

function loadIntentHandlers(userId, sendMessageCallback){
	console.log('### loading intent handlers');
	intentHandlers = [];
	var intentHandlersFiles = fs.readdirSync('./src/intent-handlers');
	for(intentHandlerFile of intentHandlersFiles){
		console.log('### loading: ' + './src/intent-handlers/' + intentHandlerFile);
		var intentHandler = require('./src/intent-handlers/' + intentHandlerFile);
		intentHandlers[intentHandlerFile.substring(0, intentHandlerFile.indexOf('.js'))] = intentHandler;
	}
	
	if(sendMessageCallback) sendMessageCallback(userId, {text: 'done'});
	return;
}

function loadServerRoutines(userId, sendMessageCallback){
	console.log('### loading server routines');
	serverRoutines = [];
	var serverRoutinesFiles = fs.readdirSync('./src/server-routines');
	for(serverRoutinesFile of serverRoutinesFiles){
		console.log('### loading: ' + './src/server-routines/' + serverRoutinesFile);
		var serverRoutine = require('./src/server-routines/' + serverRoutinesFile);
		serverRoutines[serverRoutinesFile.substring(0, serverRoutinesFile.indexOf('.js'))] = serverRoutine;
	}
	
	serverRoutines['loadDataFiles'] = loadDataFiles;
	serverRoutines['loadIntentHandlers'] = loadIntentHandlers;
	serverRoutines['loadServerRoutines'] = loadServerRoutines;
	
	if(sendMessageCallback) sendMessageCallback(userId, {text: 'done'});
	return;
}

// loading data files
loadDataFiles(null, null);
// loading intent handlers
loadIntentHandlers(null, null);
// loading server routines
loadServerRoutines(null, null);

// initializing api.ai
var apiai = require('apiai');
var apiaiService = apiai('CLIENT_ACCESS_TOKEN');

function apiaiResponseHandler(response) {
	// console.log('### api.ai response:');
	// console.log(response);
	
	var intentName = response.result.metadata.intentName;
	intentHandlers[intentName](data, response, sendMessage);
}

function apiaiErrorHandler(error) {
    console.log('### api.ai error:');
	console.log(error);
}

// intializing messages handlers
function handleUserMessage(event){
	var request = apiaiService.textRequest(event.message.text, {
		sessionId: event.sender.id.toString()
	});
	
	request.on('response', apiaiResponseHandler);
	request.on('error', apiaiErrorHandler);
	request.end();
}

function handleAdminMessage(event){
	var command = event.message.text.substring(8);
	if(!(serverRoutines[command])) sendMessage(event.sender.id, {text: 'no such command: ' + command});
	else serverRoutines[command](event.sender.id, sendMessage);
}

// starting the web service
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var webapp = express();
var port = process.env.PORT || 5000;
var FB_PAGE_ID = 'FB_PAGE_ID';
var ADMIN_PASSWORD = 'ADMIN_PASSWORD';
var VERIFY_TOKEN = 'VERIFY_TOKEN';
webapp.use(bodyParser.urlencoded({extended: false}));
webapp.use(bodyParser.json());
webapp.listen(port);

// Server frontpage
webapp.get('/', function (req, res) {
    res.send('This is CodeforcesBot Server');
});

// Facebook Webhook
webapp.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// handler receiving messages
webapp.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
	if(!events) events = [];
    for (i = 0; i < events.length; i++) {
        var event = events[i];
		if (event.sender.id.toString() === FB_PAGE_ID) continue;
        if (event.message && event.message.text) {
			// sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
			// console.log('### user id: ' + event.sender.id.toString());
			// console.log('### received message: ' + event.message.text);
			
            if(event.message.text.indexOf(ADMIN_PASSWORD) === 0)
				handleAdminMessage(event);
			else handleUserMessage(event);
        }
		else if(event.message){
			sendMessage(event.sender.id, {text: 'sorry, i only respond to text messages'});
		}
    }
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('### Error sending message: ', error);
        } else if (response.body.error) {
            console.log('### Error: ', response.body.error);
        }
    });
}
