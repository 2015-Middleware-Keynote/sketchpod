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
var cuid = false;
var submission = false;
var username = false;

// Routes
app.get('/status', function (req, res, next) { res.send("{status: 'ok'}"); });
app.put('/doodle', doodleController.receiveImage);
app.get('/', function (req, res, next){
  var html  = index.toString()
             .replace( /\{\{SUBMISSION\}\}/, submission || config.get('SUBMISSION'))
             .replace( /\{\{USERNAME\}\}/, username || config.get('USERNAME'))
             .replace( /\{\{CUID\}\}/, cuid || config.get('CUID'))
  res.status(200);
  res.header('Content-Type', 'text/html');
  res.end(html.replace(/host:port/g, req.header('Host')));
})

// Serve all the static assets prefixed at /static
app.get('.*', restify.serveStatic({directory: './static/'}));

app.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT') )
});

// Sockets:
var WebSocketServer = require('ws').Server
  , thousand = require('./thousand')
var wss = new WebSocketServer({server: app, path: '/thousand'});
var eventEmitter = thousand.doodleEmitter;
var count = 0;
var clients = {};

wss.broadcast = function broadcast(data) {
  for (var i in clients) {
    var ws = clients[i];
    if (ws.readyState === ws.OPEN) {
      ws.send(data);
    } else if (ws.readyState === ws.CLOSED) {
      console.log('Peer #' + ws.id + ' disconnected from /thousand.');
      delete clients[ws.id];
    }
  };
};

wss.on('connection', function connection(ws) {
var id = count++;
clients[id] = ws;
ws.id = id;
console.log('/thousand connection');
var subscription;
subscription = thousand.events.subscribe(function(event) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify({type: 'event', data: event}));
  };
});
ws.on('message', function(data, flags) {
var message = JSON.parse(data);
  if (message.type === 'ping') {
    ws.send(JSON.stringify({type: 'pong'}));
  }
});
ws.onclose = function() {
  console.log('Onclose: disposing /thousand subscriptions');
  subscription && subscription.dispose();
};
});

eventEmitter.on('new-doodle', function(doodle) {
console.log('doodle listener invoked.');
  wss.broadcast(JSON.stringify({type: 'doodle', data: doodle}));
});

