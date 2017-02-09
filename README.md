# codeforces-assistant
A chatbot integrated with Facebook messenger, api.ai, and codeforces.com that allows users to accomplish most of their browsing activities on Codeforces faster, easier and using natural language queries.

## System components
The chatbot is integrated with Facebook messenger through which users and system administrators can interact with the system. The server component is implemented using NodeJS as a web server hosted on [Heroku](https://www.heroku.com/).
For a natural language query preprocessor, the system uses [api.ai](https://api.ai/).
The sever component simply uses the local file system to store data as JSON files. There are three JSON files in the system, one contains data of all problems on Codeforces, one for data of all contests, and the last one is used to initialise an empty object used to cache information about upcoming or running contests. New files may be added as needed if any new features were introduced that needs other entities to operate. These files are automatically loaded on server startup and can be updated and reloaded in the runtime. The data files currently included in the repository contains example data.
There are three core server routines implemented within the server module, these server routines are responsible for loading data files, other server routines and intent handlers. Other than these three server routines an arbitrary number of server routines can exist as separate modules. All server routines are loaded automatically on server startup and can be reloaded manually any time later by invoking the routine responsible for loading server routines. The system includes two separate server routines, one for updating problems data file, and the other for updating the contests data file. Each server routine can be invoked by a predefined command. For each incoming message, the system checks if it starts with the admin password, and consider the rest of the message as the command, and invokes the corresponding routine.
As with server routines, intent handlers are implemented as separate modules and are loaded in the same manner. There are three main features, thus three intent handlers. In addition, there are three basic intent handlers for the welcome intent, the fallback intent and the help intent. Ideally, each intent handler should map to an intent in api.ai agent, however, there is no direct coupling between them, so it can be controlled by implementing the appropriate logic.

![system diagram](/images/img01.JPG)

###### Notes:
- Before running the server you should replace `CLIENT_ACCESS_TOKEN` in server.js with the correct access token of your api.ai agent. This access token can be found in your agent's settings in API Keys section.
- You should also replace `FB_PAGE_ID` and `VERIFY_TOKEN` in server.js with the correct values. FB_PAGE_ID is the id of the facebook page to which the app is subscribed. VERIFY_TOKEN is the choosen token used to verify your webhook.
- `ADMIN_PASSWORD` is used to access adminstrative features, so it can be of any value.
