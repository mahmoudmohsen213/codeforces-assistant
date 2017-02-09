function sendUpcomingContests(sendMessageCallback, userId, contestList){
	var messages = ['yes, we got ' + contestList.length + ' upcoming or running contests'];
	var date = new Date();
	var messageDelay = 1000;
	for(contest of contestList){
		date.setTime((contest.startTimeSeconds)*1000);
		if(contest.phase == 'CODING')
			messages.push('http://codeforces.com/contests/' + 
							contest.id + ' running, started on ' + date.toUTCString());
		else messages.push('starting on ' + date.toUTCString() + 
							' http://codeforces.com/contests/' + contest.id);
	}
	
	for(message of messages){
		setTimeout(sendMessageCallback, messageDelay, userId, {text: message});
		messageDelay += 1500; // 1.5 seconds between each message
	}
}

function getUpcomingContests(data, response, sendMessageCallback) {
	var userId = response.sessionId;
	var httpRequest = require('http');
	sendMessageCallback(userId, {text: 'please wait a moment...'});
	
	if(data['upcomingcontests'].state == 'READY'){
		var updateTime = data['upcomingcontests'].updateTime;
		var contestList = data['upcomingcontests'].contests;
		var currentTime = (new Date()).getTime();
		var ONE_HOUR_MILLISECONDS = 60*60*1000;
		if((currentTime - updateTime) <= ONE_HOUR_MILLISECONDS){
			sendUpcomingContests(sendMessageCallback, userId, contestList);
			return;
		}
	}
	else {
		setTimeout(getUpcomingContests, 5000, data, response, sendMessageCallback);
		return;
	}
	
	data['upcomingcontests'].state = 'UPDATING';
	httpRequest.get({
        host: 'codeforces.com',
        path: '/api/contest.list'
    }, function(response) {
        var body = '';
        response.on('data', function(responseData) {
            body += responseData;
        });
        response.on('end', function() {
            body = JSON.parse(body);
			if(body.status != 'OK')
				sendMessageCallback(userId, {text: 'sorry, there seems to be a problem with codeforces, try again later'});
			else{
				var contestList = body.result.filter(function(contest){
					return (contest.phase == 'BEFORE') || (contest.phase == 'CODING');
				});
				data['upcomingcontests'].updateTime = (new Date()).getTime();
				data['upcomingcontests'].contests = contestList;
				if(contestList.length == 0)
					sendMessageCallback(userId, {text: 'nope, there is no upcoming contests at the moment'});
				else sendUpcomingContests(sendMessageCallback, userId, contestList);
			}
			
			data['upcomingcontests'].state = 'READY';
        });
    });
	
	return;
}

module.exports = getUpcomingContests;

/*
upcoming contests object format:
{
	'state':'READY',
	'updateTime':0,
	'contests':[]
}

updateTime: the last update time in milliseconds
state: READY or UPDATING, UPDATING if there is another async function currently 
		working on updating it, the function that changed its state from READY
		to UPDATING is responsible for changing it back.
contests: array of contests objects, the upcoming contest list.
*/