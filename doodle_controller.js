'use strict';

var fs = require('fs')
  , os = require('os')
  , thousand = require('./thousand')
  , eventEmitter = thousand.doodleEmitter
  ;

module.exports = exports = {
  receiveImage: function(req, res, next) {
    console.log('originalUrl', req.query);

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
        console.log('originalUrl', req.originalUrl);
        fs.write(fd, data, 0, data.length, 0, function(err, written, buffer) {
          if (err) {
            next(err);
          };
          eventEmitter.emit('new-doodle', {
            url: '/doodle',
            name: req.query.username,
            cuid: req.query.cuid,
            submission: req.query.submission
          })
          return res.json({
            url:'http://localhost:8080/img/doodle.png'
          , name:req.query.username
          , cuid:req.query.submission
          , submission:req.query.cuid
          });
        });
      })
    });
  }
};
