function binarySearch(sortedContestsList, id){
	var start = 0, end = sortedContestsList.length-1, mid;
	while(start<end){
		mid = start+((end-start+1)>>1);
		if(sortedContestsList[mid].id == id) return mid;
		else if(sortedContestsList[mid].id < id) start = mid;
		else end = mid - 1;
	}
	
	return start;
}

function getRandomProblem(data, response, sendMessageCallback) {
	var userId = response.sessionId;
	var parameters = response.result.parameters;
	var problemDifficulty = parameters['problem-difficulty'].split(';');
	var problemIndex = 'random';
	var contestLevel = 'random';
	var problemType = parameters['problem-type'];
	
	if(problemDifficulty.length > 1)
		contestLevel = 'div. ' + problemDifficulty[1];
	
	if(problemDifficulty.length == 3)
		problemIndex = problemDifficulty[2];
	
	if((problemIndex !== 'random')&&(problemIndex.length == 7))
		problemIndex = problemIndex[6];
	if((contestLevel !== 'random')&&(contestLevel.length == 7))
		contestLevel = 'Div. ' + contestLevel[4];
	
	var problems = data['problemsetproblems'].result.problems;
	var contests = data['contestlist'].result;
	var validProblems = [];
	var startIndex = Math.trunc(Math.random()*(problems.length - 501));
	var searchWindow = 500;
	for(var i = startIndex;i < (startIndex + searchWindow);++i){
		var validType = false;
		var validDifficulty = false;
		if((problemType == 'random')||(problems[i].tags.indexOf(problemType) != -1))
			validType = true;
		
		if(contestLevel == 'random')
			validDifficulty = true;
		else{
			var contestIndex = binarySearch(contests, problems[i].contestId);
			if(((contests[contestIndex].name.toLowerCase()).indexOf(contestLevel) != -1) &&
					((problemIndex == 'random')||(problemIndex == problems[i].index)))
				validDifficulty = true;
		}
		
		if(validType && validDifficulty)
			validProblems.push(problems[i]);
	}
	
	if(validProblems.length == 0){
		sendMessageCallback(userId, {text: 'sorry! couldn\'t find any matching problems'});
		return;
	}
	
	var messages = ['take a look at these...'];
	var shuffle = require('shuffle-array');
	validProblems = shuffle.pick(validProblems, { 'picks': 3 });
	for(problem of validProblems)
		messages.push('http://codeforces.com/problemset/problem/' + problem.contestId + '/' + problem.index);
	
	var messageDelay = 0;
	for(message of messages){
		setTimeout(sendMessageCallback, messageDelay, userId, {text: message});
		messageDelay += 2000; // 2 seconds between each message
	}
	return;
}

module.exports = getRandomProblem;