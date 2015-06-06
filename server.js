var cc       = require('config-multipaas'),
    fs       = require('fs'),
    os       = require('os'),
    restify  = require('restify')
    querystring = require('querystring');

var app = restify.createServer();

var config = cc();

var sketch = {
  cuid : process.env.CUID || 'unknown client id',
  username : process.env.USERNAME || 'unclaimed',
  submission : process.env.SUBMISSION || 'no doodle'
};

var index = fs.readFileSync(__dirname + '/static/index.html');

var receiveImage = function(req, res, next) {
  var data = new Buffer('');
  req.on('data', function(chunk) {
    data = Buffer.concat([data, chunk]);
  });
  req.on('error', function(err) {
    next(err);
  });
  req.on('end', function() {
    var filename = './static/img/doodle.png';
    fs.open(filename, 'w', function(err, fd) {
      if (err) {
        next(err);
      };
      var query = querystring.parse(req.query());
      fs.write(fd, data, 0, data.length, 0, function(err, written, buffer) {
        if (err) {
          next(err);
        };
        sketch.url = 'http://localhost:8080/img/doodle.png';
        sketch.username = query.username;
        sketch.cuid = query.cuid;
        sketch.submission = query.submission;
        return res.json(sketch);
      });
    })
  });
}

// Routes
app.head('/status', function (req, res, next) { res.send() });
app.get('/status', function (req, res, next) { res.send("{status: 'ok'}"); });
app.put('/doodle', receiveImage);
app.get('/', function (req, res, next) {
  var html  = index.toString()
             .replace( /\{\{SUBMISSION\}\}/, sketch.submission)
             .replace( /\{\{USERNAME\}\}/, sketch.username)
             .replace( /\{\{CUID\}\}/, sketch.cuid)
  res.status(200);
  res.header('Content-Type', 'text/html');
  res.end(html.replace(/host:port/g, req.header('Host')));
})

// Serve all the static assets prefixed at /static
app.get('.*', restify.serveStatic({directory: './static/'}));

app.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT') )
});
