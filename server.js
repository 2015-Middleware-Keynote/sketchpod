var cc       = require('config-multipaas'),
    fs       = require('fs'),
    restify  = require('restify'),
    doodleController = require('./doodle_controller.js')

var app      = restify.createServer()

// Default state:
var unknown_client_id = 'unknown client id'
var unknown_user_name = 'unclaimed'
var unknown_submission= 'no doodle'

var config   = cc().add({
  CUID : process.env.CUID || unknown_client_id,
  USERNAME : process.env.USERNAME || unknown_user_name,
  SUBMISSION : process.env.SUBMISSION || unknown_submission
});
var index = fs.readFileSync(__dirname + '/index.html');

// Routes
app.get('/status', function (req, res, next) { res.send("{status: 'ok'}"); });
app.post('/api/doodle/', doodleController.receiveImage);
app.get('/', function (req, res, next){
  var html  = index.toString()
             .replace( /\{\{SUBMISSION\}\}/, config.get('SUBMISSION'))
             .replace( /\{\{USERNAME\}\}/, config.get('USERNAME'))
             .replace( /\{\{CUID\}\}/, config.get('CUID'))
  res.status(200);
  res.header('Content-Type', 'text/html');
  res.end(html.replace(/host:port/g, req.header('Host')));
})

// Serve all the static assets prefixed at /static
app.get('.*', restify.serveStatic({directory: './static/'}));

app.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT') )
});
