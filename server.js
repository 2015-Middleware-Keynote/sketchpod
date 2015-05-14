var cc       = require('config-multipaas'),
    fs       = require('fs'),
    http     = require("http"),
    st       = require("st"),
    Router   = require("routes-router"),
    sendJson = require("send-data/json"),
    sendHtml = require("send-data/html"),
    sendError= require("send-data/error")

var app      = Router()

// Default state:
var unknown_client_id = 'unknown client id'
var unknown_user_name = 'unclaimed'
var unknown_submission= 'no doodle'

var config   = cc().add({
  CUID : process.env.CUID || unknown_client_id,
  USERNAME : process.env.USERNAME || unknown_user_name,
  SUBMISSION : process.env.SUBMISSION || unknown_submission
})

// Routes
app.addRoute("/status", function (req, res, opts, cb) {
  sendJson(req, res, "{status: 'ok'}")
})

app.addRoute("/", function (req, res, opts, cb) {
  var index = fs.readFileSync(__dirname + '/index.html');
  var html  = index.toString()
               .replace( /\{\{SUBMISSION\}\}/, config.get('SUBMISSION'))
               .replace( /\{\{USERNAME\}\}/, config.get('USERNAME'))
               .replace( /\{\{CUID\}\}/, config.get('CUID'))
  sendHtml(req, res, {
    body: html,
    statusCode: 200,
    headers: {}
  })
})

// Serve all the static assets prefixed at /static
// so GET /js/app.js will work.
app.addRoute("/*", st({
  path: __dirname + "/static",
  url: "/"
}))

var server = http.createServer(app)
server.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT') )
});
