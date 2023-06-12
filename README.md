# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Before starting, make sure to download Node.js which can be downloaded here: https://nodejs.org/en/download

Welcome to WhatsTheMove! A web app where you can post events on a calendar for your friends to see! Follow the instructions below to get the web app running on your local machine and begin posting events!

## Available Scripts
Clone the WhatsTheMove repository that you're currently looking at into a local machine. This can easily be done using git clone. Once cloned, make the repository your current directory.

In the project directory, you can run:

### `npm i` or `npm install`
To install all packages in order to run our application. This will install everything, and a .gitignore file will hold collection of packages such as node_modules which are very large. This simple install command will install all required packages.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

Congratulations! You've successfully ran WhatsTheMove on your local machine. You can now begin to post and see events with your friends!

## How to Use

Login Page
- Presented with web app logo, user can click on the button and utilize a Google email account to join.

Calendar
- navigate calendar using arrows, reset by clicking today
- create events by clicking on a day of choice and fill in title, description, label color, and visibility
- Users can exit the event creation without saving by clicking outside of window, clicking on the x button on the top right, or simply pressing the 'Delete' key.
- private events are not visibile to anyone else
- public events are visible to all friends
- close friends events are only visible to close friends
- Users can save created event by either clicking on the save button or by pressing the 'Enter' key.

Friends
- send friend requests by entering email address associated with the account
- accept/decline incoming friend requests
- add friends from friends list to close friends list 
- remove friends from friends list, even if they are in your close friend list

Upcoming Events
- see all upcoming events and search by username, date

Past Events
- see all passed events and search by username, date 
- upload image(s) to past events to save memmories 
