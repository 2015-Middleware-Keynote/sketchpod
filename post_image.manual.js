var request = require('request')
  , fs = require('fs')

var readStream = fs.createReadStream('static/img/cherries.png');
var png = fs.readFileSync(__dirname + '/static/img/cherries.png');

var url = 'http://localhost:8080/doodle?name=John%20Doe&cuid=007&submission=awesome';

readStream.pipe(request.put(url, function (err, res, body) {
  if (err) {
    throw new Error(err);
  }
  console.log('res', res.body);
}));
//readStream.pipe(req);
