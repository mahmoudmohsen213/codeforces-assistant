function sendMessages(sendMessageCallback, userId, messages){
	var messageDelay = 0;
	for(message of messages){
		setTimeout(sendMessageCallback, messageDelay, userId, {text: message});
		messageDelay += 2000; // 2 seconds between each message
	}
}

function getProblem(data, response, sendMessageCallback) {
	var userId = response.sessionId;
	var parameters = response.result.parameters;
	var problems = data['problemsetproblems'].result.problems;
	var messages = [];
	
	if((parameters['problem-id'].length == 0) && (parameters['problem-name'].length == 0)){
		sendMessages(sendMessageCallback, userId, ['you must specify the problem id or name']);
		return;
	}
	
	if(parameters['problem-id'].length != 0){
		var problemId = parameters['problem-id'].toUpperCase();
		var contestId = problemId.substring(0, problemId.length-1);
		var problemIndex = problemId[problemId.length-1];
		for (problem of problems){
			if((problem.contestId == contestId)&&(problem.index == problemIndex)){
				messages.push('here is problem ' + problemId);
				messages.push('http://codeforces.com/problemset/problem/' + problem.contestId + '/' + problem.index);
				sendMessages(sendMessageCallback, userId, messages);
				return;
			}
		}
		
		messages.push('sorry! no problem with the id ' + parameters['problem-id'] + ' was found ');
	}
	
	if(parameters['problem-name'].length != 0){
		var problemName = parameters['problem-name'].toLowerCase();
		for (problem of problems){
			if(problem.name.toLowerCase() === problemName){
				messages.push('here is problem ' + problem.name);
				messages.push('http://codeforces.com/problemset/problem/' + problem.contestId + '/' + problem.index);
				sendMessages(sendMessageCallback, userId, messages);
				return;
			}
		}
	}
	
	messages = ['sorry! no such problem'];
	if(parameters['problem-id'].length != 0) messages.push('problem id ' + parameters['problem-id']);
	else if(parameters['problem-name'].length != 0) messages.push('problem name ' + parameters['problem-name']);
	sendMessages(sendMessageCallback, userId, messages);
	return;
}

module.exports = getProblem;