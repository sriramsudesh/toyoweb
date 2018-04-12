/**
* @Date:   2017-01-11T21:21:03-06:00
 * @Last modified time: 2017-05-26T11:45:50-05:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/

let cfenv = require('cfenv')
let fs = require('fs')
let util = require('util')

/** VCAP services */
let vcapServices = {}

/** Environemnt variables */
let envVars = {}

/** Cloud foundry app environment */
let appEnv = cfenv.getAppEnv()
// dotenv.config()

if (process.env.VCAP_SERVICES) {
  vcapServices = JSON.parse(process.env.VCAP_SERVICES)
/** otherwise use our JSON file */
} else if (appEnv.VCAP_APPLCATION) {
  vcapServices = appEnv.getServices()
} else {
  try {
    vcapServices = JSON.parse(fs.readFileSync('./vcap.env', 'utf8'))
  } catch (e) {
    console.log('no development vcap.env file found')
  }
}
/** If running in Bluemix, use the environment variables */
process.env.CONVERSATION_API_URL = appEnv.CONVERSATION_API_URL || process.env.CONVERSATION_API_URL
process.env.NATURAL_LANGUAGE_VERSION = appEnv.NATURAL_LANGUAGE_VERSION || process.env.NATURAL_LANGUAGE_VERSION
process.env.NATURAL_LANGUAGE_URL = appEnv.NATURAL_LANGUAGE_URL || process.env.NATURAL_LANGUAGE_URL
process.env.NATURAL_LANGUAGE_USERNAME = appEnv.NATURAL_LANGUAGE_USERNAME || process.env.NATURAL_LANGUAGE_USERNAME
process.env.NATURAL_LANGUAGE_PASSWORD = appEnv.NATURAL_LANGUAGE_PASSWORD || process.env.NATURAL_LANGUAGE_PASSWORD
process.env.GOOGLE_STREETVIEW_KEY = appEnv.GOOGLE_STREETVIEW_KEY || process.env.GOOGLE_STREETVIEW_KEY
process.env.ZILLOW_DEEPSEARCH_URL = appEnv.ZILLOW_DEEPSEARCH_URL || process.env.ZILLOW_DEEPSEARCH_URL
process.env.ZILLOW_ZWS_ID = appEnv.ZILLOW_ZWS_ID || process.env.ZILLOW_ZWS_ID

/** For display */
envVars.CONVERSATION_API_URL = process.env.CONVERSATION_API_URL
envVars.NATURAL_LANGUAGE_VERSION = process.env.NATURAL_LANGUAGE_VERSION
envVars.NATURAL_LANGUAGE_URL = process.env.NATURAL_LANGUAGE_URL
envVars.NATURAL_LANGUAGE_USERNAME = process.env.NATURAL_LANGUAGE_USERNAME
envVars.NATURAL_LANGUAGE_PASSWORD = process.env.NATURAL_LANGUAGE_PASSWORD
envVars.GOOGLE_STREETVIEW_KEY = process.env.GOOGLE_STREETVIEW_KEY
envVars.ZILLOW_DEEPSEARCH_URL = process.env.ZILLOW_DEEPSEARCH_URL
envVars.ZILLOW_ZWS_ID = process.env.ZILLOW_ZWS_ID

/** Application Constants */
const CONSTANTS = {
  API_PROP_SUGGEST: 'propertySuggestion'
}

global.CONSTANTS = CONSTANTS
/**
 * Prints information about the environment
 *
 * @return {void}
 */
function printEnvInfo () {
  console.log('---CUSTOM ENV VARIABLES---')
  console.log(envVars)
  console.log('------APP ENVIRONMENT------')
  console.log(appEnv)
  console.log('-------VCAP SERVICES-------')
  console.log(util.inspect(vcapServices, {depth: 5}))
  console.log('---------CONSTANTS---------')
  console.log(CONSTANTS)
}

module.exports = function (app) {
  printEnvInfo()
  global.thisApp = app
  global.appEnv = appEnv

  /**
   * Set environment variables as express properties
   * Acess through app.get('VARIABLE_NAME') where app is your express app
   */
  for (let prop in global.envVars) {
    app.set(prop, global.envVars[prop])
  }
}
