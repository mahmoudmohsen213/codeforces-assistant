function helpIntent(data, response, sendMessageCallback) {
	var userId = response.sessionId;
	var messages = [];
	messages.push('if you want a specific problem by id say \'problem ID\' ' + 
					'where ID is the problem id for example 55A, or 245C.');
	messages.push('if you want a specific problem by name say \'problem NAME\' ' + 
					'where NAME is the problem name.');
	messages.push('if you want some random problems, you can specify its difficulty, ' + 
					'its type, both, or none of them for totally random problem, ' + 
					'difficulty is CONTEST_LEVEL-PROBLEM_INDEX, for example div1-A, ' + 
					'or div2-C, or just the CONTEST_LEVEL, div1 or div2, problem ' + 
					'type can be any of codeforces problem tags, for example ' + 
					'\'do you have any div1-B dp problems?\'');
	messages.push('if you want to know if there is any upcoming contest announced, ' + 
					'ask anything like \'is there any upcoming contests?\'');	
	var messageDelay = 0;
	for(message of messages){
		setTimeout(sendMessageCallback, messageDelay, userId, {text: message});
		messageDelay += 1500; // 1.5 seconds between each message
	}
	return;
}

module.exports = helpIntent;