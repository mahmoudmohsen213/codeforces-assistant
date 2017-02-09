function updateContestList(userId, sendMessageCallback) {
	console.log('### updating contest list');
	var httpRequest = require('http');
	var fs = require('fs');
	httpRequest.get({
        host: 'codeforces.com',
        path: '/api/contest.list'
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
				var contestList = body.result;
				contestList.sort(function(contest1, contest2){
					return ((contest1.id > contest2.id) ? 1 : -1);
				});
				body.result = contestList;
				body = JSON.stringify(body);
				fs.writeFile('./data_files/contestlist.json', body, function (err) { if (err) throw err; });
				if(sendMessageCallback) sendMessageCallback(userId, {text: 'done'});
			}
        });
    });
	
	return;
}

module.exports = updateContestList;