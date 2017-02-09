function defaultFallbackIntent(data, response, sendMessageCallback) {
	var userId = response.sessionId;
	sendMessageCallback(userId, {text: response.result.fulfillment.messages[0].speech});
}

module.exports = defaultFallbackIntent;