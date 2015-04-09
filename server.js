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
var unknown_user_id = 'unknown'
var unknown_claim = 'not claimed'

var config   = cc().add({
  user_id : process.env.DEMO_USER_ID || unknown_user_id,
  claim : process.env.DEMO_CLAIM || unknown_claim
})

// Routes
app.addRoute("/status", function (req, res, opts, cb) {
  sendJson(req, res, "{status: 'ok'}")
})

app.addRoute("/", function (req, res, opts, cb) {
  var index = fs.readFileSync(__dirname + '/index.html');
  var html  = index.toString()
               .replace( /\{\{USER_ID\}\}/, config.get('user_id'))
               .replace( /\{\{CLAIM\}\}/, config.get('claim'))
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
