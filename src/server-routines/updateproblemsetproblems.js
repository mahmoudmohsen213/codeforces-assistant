function updateProblemsetProblems(userId, sendMessageCallback) {
	console.log('### updating problemset problems');
	var httpRequest = require('http');
	var fs = require('fs');
	httpRequest.get({
        host: 'codeforces.com',
        path: '/api/problemset.problems'
    }, function(response) {
        var body = '';
        response.on('data', function(data) {
            body += data;
        });
        response.on('end', function() {
            body = JSON.parse(body);
			if((body.status != 'OK')&&(sendMessageCallback))
				sendMessageCallback(userId, {text: JSON.stringify(body)});
			else{
				var problemList = body.result.problems;
				problemList.sort(function(problem1, problem2){
					if(problem1.contestId != problem2.contestId)
						return ((problem1.contestId > problem2.contestId) ? 1 : -1);
					else return ((problem1.index > problem2.index) ? 1 : -1);
				});
				body.result.problems = problemList;
				
				var problemStatisticsList = body.result.problemStatistics;
				problemStatisticsList.sort(function(problemStatistic1, problemStatistic2){
					if(problemStatistic1.contestId != problemStatistic2.contestId)
						return ((problemStatistic1.contestId > problemStatistic2.contestId) ? 1 : -1);
					else return ((problemStatistic1.index > problemStatistic2.index) ? 1 : -1);
				});
				body.result.problemStatistics = problemStatisticsList;
				
				body = JSON.stringify(body);
				fs.writeFile('./data_files/problemsetproblems.json', body, function (err) { if (err) throw err; });
				if(sendMessageCallback) sendMessageCallback(userId, {text: 'done'});
			}
        });
    });
	
	return;
}

module.exports = updateProblemsetProblems;