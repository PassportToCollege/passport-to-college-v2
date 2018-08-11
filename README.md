# Passport to College - 2.0

This server-side rendered React web application replaces the [passport-to-college](https://github.com/PassportToCollege/passport-to-college) Keystone.js application. To get it up and running follow the instructions below:



## Requirement

### node.js@latest-lts
Download [here](https://nodejs.org/en/download/)



## Instructions
1. Ensure the latest LTS version of node.js is installed on your system.
2. Clone this repository onto your local machine.
3. Navigate to the cloned repository on your local machine using your terminal and run `npm install` to install all the project dependencies.
4. Obtain the .env file required to configure firebase and facebook login. 
5. Place the .env file in the root of the project folder on your local machine. __DO NOT REMOVE THE .ENV FILE FROM THE IGNORE LIST__
6. To start the local server run `npm start`. The project will compile and start a server @ [localhost:3000](http://127.0.0.1:3000).
7. You should now be able to open a browser window and navigate to the application.

#### Note
If you will be working on emails you will also need to clone [passport-to-college-emails](https://github.com/PassportToCollege/passport-to-college-emails) and have it running in the background. It runs on localhost:4000, so it will not interfere with this project's server.
