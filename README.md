![Watson Logo](./readme/img/watson-tile-pos.png)

# Watson Real Estate Agent Accelerator

The Watson Real Estae Agent Acelerator provides the ability to:

1. Provide a user interface to interact with a virtual Watson Real Estate Agent that will demonstrate a seller qualification process and answer general real estate questions.
2. Demonstrate the ability to interface with external APIs to enrich the conversation responses with dynamic information
3. Demonstrate techniques to interface with conversation outside of traditional typed responses.
4. Provide a responsive application that will scale appropriate for mobile through desktop modes.

## Default Password
The application is password protected by default. The default credentials are:

```
username: ibm
password: watson
```

## Prerequisites
The application requires the following applications

1. Node (7.6+) Application runtime environment
2. NPM (3.10+) Server side dependency management

## Application Architecture
### IBM Cognitive Technology
This application uses the following cognitive technologies

1. Watson Conversation
2. Natural Language Understanding

### Third Party Technology
This application uses the following technologies

1. Zillow Real Estate API
2. Google Street View

### Application Entry
The application has 3 main entry points.

1. /
   * The application and static content is served from this path
2. /api
   * APIs are exposed at this path, details provided below.
3. /explorer
	* The Loopback API Explorer is served from this point.


 The main executable for the application is [server.js](./server/server.js)

### Starting the application
There are a few quick steps required to stand up the application. In general, the required tasks are.

1. Install the server and client dependencies
2. Commission the required services
3. Configure the environment variables in manifest.yml (cloud deployment) or .env (local deployment)
4. Build and run or deploy

#### Installing the server and client dependencies
The server dependencies are controlled and defined in [the main package.json](./package.json).

The client dependencies are controlled and defined in [the client package.json](./client/package.json).


To install all required dependencies to both build the application and and execute the application, execute the following script from the project root. For compatibility, these commands should **not** be executed as root.

```
npm run init
```

#### Commisioning the Required Services
There are two required services:
##### Conversation
A instance of Watson Conversation will need to be [commissioned on Bluemix.] (https://www.ibm.com/cloud-computing/bluemix/)

When the demo conversation has been imported. the environment variables will need to be updated to reflect this instance of Watson Conversation. Please see the section on *Environment Variables* in order for these instructions.

#### Configuring the environment variables
The environment variables that must be defined prior to using the application are:

|Environment Variable|Description|Default Value|
|--------------------|-----------|-------------|
|CONVERSATION\_API\_URL| The endpoint to the conversation API. Includes credentials. Value should be provided in this form, with values for [USERNAME], [PASSWORD], and [WORKSPACE_ID] https://[USERNAME]:[PASSWORD]@gateway.watsonplatform.net/conversation/api/v1/workspaces/[WORKSPACE_ID]/message?version=2016-09-20 | No Default
|NATURAL\LANGUAGE\VERSION|The version of the NLU API to use | 2017-02-27
|NATURAL\_LANGUAGE\_URL|The base URL for NLU | https://gateway.watsonplatform.net/natural-language-understanding/api
|NATURAL\_LANGUAGE\_USERNAME| The username for NLU
|NATURAL\_LANGUAGE\_PASSWORD| The password for NLU
|GOOGLE\_STREETVIEW\_KEY| The developer key for Google Streetview API | No Default
|ZILLOW\_DEEPSEARCH\_URL| The endpoint for Zillow's Deep Search API | http://www.zillow.com/webservice/GetDeepSearchResults.htm
|ZILLOW\_ZWS\_ID| Zillow API Key | No Default

**Cloud Deployments (like Bluemix):** For cloud-based deployments, environment variables should be set on the cloud foundry environment varibles console. This will allow environment variables to be set and updated without requiring a new deployment. When environment variables are updated, the environment will need to be cycled. A manifest file should be used in order to set these values at deployment. A sample manifest file is provided at [manifest.yml.example](./manifest.yml.example)

**Local or Virtual Machines:** For deployments that are not cloud-based, environment variables should be set in a .env file, located at the project root. A sample .env file is available at [.env.example](./.env.example)

#### Starting the Application
##### Local Environments
#####Development Mode:

This mode will build and serve the complete application and will rebuild and restart when it detects changes to the source. Issue the following command to start the application in development mode:


```
npm run develop
```

#####Standard Mode:

This mode will build and serve the complete application but it will not rebuild and restart when it detects changes to the source. Issue the following command to start the application in standard mode:

```
npm run serve
```

#### Deploying the Application

If the application is intended to be deployed to a cloud foundary environment like Bluemix, there are two steps that must be done.

1. Build the application
2. Set up the manifest.yml

These steps are automated for cloud foundary environemnt with the following command:

```
gulp publish
```

**Important**
Ensure that you have configured your cloud foundary CLI for the correct target. This can be verified for bluemix with a `bluemix target` command.


##### Building the application

To build the application, issue the following command:

```
npm run build:client
```

This will compile all server code and package all client code into the /dist/ directory

##### Configuring the manifest.yml

Once built, the manifest should be configured so that the environment variables are properly defined. A sample manifest.yml is provided at [./manifest.yml.example](./manifest.yml.example)



## API Documentation

API documentation is provided via the Strongloop API Explorer. Once the application is running, simply visit \<host\>/explorer in a browser to view the API documentation
