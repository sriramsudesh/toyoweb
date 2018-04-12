'use strict'

let express = require('express')
let path = require('path')
require('dotenv').config()

let loopback = require('loopback')
let boot = require('loopback-boot')
// The following requires are for parsing the body when doing a file upload
let bodyParser = require('body-parser')
let multer = require('multer')

// Define the storage for the files being upload.
let storage = multer.memoryStorage()

let app = module.exports = loopback()

// Add the middleware to parse multipart forms
app.use(multer({storage: storage}).any())

// Parse body of incoming requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.start = function () {
  // start the web server
  return app.listen(global.appEnv.isLocal ? 3000 : global.appEnv.port, function () {
    app.emit('started')
    let baseUrl = app.get('url').replace(/\/$/, '').replace(String(global.appEnv.port), String(3000)).replace('0.0.0.0', 'localhost')
    console.log('Web server listening at: %s', baseUrl)
    if (app.get('loopback-component-explorer')) {
      let explorerPath = app.get('loopback-component-explorer').mountPath
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath)
    }
  })
}
// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err

  // start the server if `$ node server.js`
  if (require.main === module) {
    app.start()
  }
})

app.use('/', express.static('dist/client'))
app.middleware('final', (req, res, next) => {
  res.sendFile(path.resolve('dist/client/index.html'))
})
/*
app.use('/', (req, res, next) => {
  // res.sendFile(path.resolve('dist/client/rex/index.html'))
  //express.static('')
})
*/
