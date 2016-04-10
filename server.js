'use strict';

var cc       = require('config-multipaas')
  , express = require('express')
  , app = express()
  , path = require('path')
  , router = express.Router()
  , http = require('http')
  , os       = require('os')
  , fs = require('fs')

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
    var filename = os.tmpdir() + '/sketch.png';
    fs.open(filename, 'w', function(err, fd) {
      if (err) {
        next(err);
      };
      var query = req.query;
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
app.put('/doodle', receiveImage);
app.post('/doodle', receiveImage);
app.put('/doodle/', receiveImage);
app.post('/doodle/', receiveImage);
app.head('/status', function (req, res, next) { res.send(); });
app.get('/status', function (req, res, next) { res.send("{status: 'ok'}"); });
app.get('/', function (req, res, next) {
  console.log("username:" + sketch.username);
  var html  = index.toString()
             .replace( /\{\{SUBMISSION\}\}/, sketch.submission)
             .replace( /\{\{USERNAME\}\}/, sketch.username)
             .replace( /\{\{CUID\}\}/, sketch.cuid)
  res.send(html.replace(/host:port/g, req.header('Host')));
})
app.get('/sketch.png', function (req, res, next) {
  fs.stat(os.tmpdir() + '/sketch.png', function(err){
    if(err){
      res.status(404).send("404 (Not Found)");
    }else{
      fs.createReadStream(os.tmpdir() + '/sketch.png').pipe(res);
    }
  })
})

// Serve all the static assets prefixed at /static
app.use('/lib', express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'static')));

app.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT') )
});
