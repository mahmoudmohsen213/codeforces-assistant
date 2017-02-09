function welcomeIntent(data, response, sendMessageCallback) {
	var userId = response.sessionId;
	var messages = [response.result.fulfillment.messages[0].speech];
	messages.push('I am CodforcesBot, your codeforces.com assisstant :D ,, ' + 
					'let me tell you more about myself');
	messages.push('I can get you any problem by its name or ID, ' + 
					'for example you can say \'problem 55A\' or \'problem name barcode\'');
	messages.push('I can also get you some random problems to practice with, ' + 
					'you may specify its difficulty, its type, both, or none of them for totally random problems, ' + 
					'for example you can say \'get me a dp problem\', ' + 
					'or \'do you have any div2-A problems\', ' + 
					'or \'i want some div1-B math problems\'');
	messages.push('and if you needed any updates on upcoming contests, just ask');
	messages.push('for more detailed description type \'help\'');
	messages.push('why don\'t you try yourself :D');
	
	var messageDelay = 0;
	for(message of messages){
		setTimeout(sendMessageCallback, messageDelay, userId, {text: message});
		messageDelay += 2000; // 2 seconds between each message
	}
	return;
}

module.exports = welcomeIntent;