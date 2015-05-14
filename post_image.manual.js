var request = require('request')
  , fs = require('fs')
  , server_name = process.env.OPENSHIFT_SERVER || "http://localhost:8080";


var readStream = fs.createReadStream('static/img/cherries.png');
var png = fs.readFileSync(__dirname + '/static/img/cherries.png');
var url = server_name + '/doodle?name=John%20Doe&cuid=007&submission=awesome';

readStream.pipe(request.put(url, function (err, res, body) {
  if (err) {
    throw new Error(err);
  }
  console.log('res', res.body);
}));
//readStream.pipe(req);
