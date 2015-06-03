#VROOM
###iSchool Capstone
(Nov 2014 - June 2015)

####Contributors:
* Philip Rudio 
* [Danny Gonzalez](http://www.linkedin.com/in/jdannygonzalez/)
* Marissa Ho
* David Phillips
* [Stephen Ramirez](http://ramirs.github.io)

####Software Setup
* Install Node
* Install NPM
* Install Grunt Cli
* Install Bower
* Run 'npm install'

####Start Application
* Run npm start

####Problem Statement
VROOM is partnering with [UW EcoCar](http://uwecocar.com/) to create a head-up-display (H.U.D.) user interface on the car windshield, which will increase the visibility of energy consumption and car diagnostics to drivers while promoting a safe-driving experience. 


####Special Thanks to:
* [EcoCar Team](http://uwecocar.com)
* Nam-ho Park: Managing Director – Forum One, Capstone Professor, Information School, UW Seattle
* Amirah Majid: PhD Candidate, Information School, UW Seattle
* Kristen Shinohara: PhD Candidate, Information School, UW Seattle

####Application Requirements
This application will only work in the Chrome browser at the moment.

####Testing Requirements
NOTE: This is not for production
Due to the Web Speech API requiring permissions each time to use it, when run through HTTP, the current application is run through HTTPS. Certs must be created locally to be able to test this application. To create local certs for testing this application, do the following:

In a terminal in the project directory, run:

```
openssl genrsa -out vroom-key.pem
```

Then run:

```
openssl req -new -key vroom-key.pem -out certrequest.csr
```

You will have to respond to prompts, which can be anything in the case of testing.

Finally, run:

```
openssl x509 -req -days 9999 -in certrequest.csr -signkey vroom-key.pem -out vroom-cert.pem
```

Now the application should be able to run on https://localhost:8080

last updated : 6.2.15
