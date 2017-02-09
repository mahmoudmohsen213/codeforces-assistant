# codeforces-assistant
A chatbot integrated with Facebook messenger, api.ai, and codeforces.com that allows users to accomplish most of their browsing activities on Codeforces faster, easier and using natural language queries.

###### Notes:
- Before running the server you should replace `CLIENT_ACCESS_TOKEN` in server.js with the correct access token of your api.ai agent. This access token can be found in your agent's settings in API Keys section.
- You should also replace `FB_PAGE_ID` and `VERIFY_TOKEN` in server.js with the correct values. FB_PAGE_ID is the id of the facebook page to which the app is subscribed. VERIFY_TOKEN is the choosen token used to verify your webhook.
- `ADMIN_PASSWORD` is used to access adminstrative features, so it can be of any value.
