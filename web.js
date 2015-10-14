var port = Number(process.env.PORT || 8000);
var express = require('express');
var app = express();

app.use('/', express.static('app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.get('/*', function(req, res, next) {
  res.sendFile('index.html', { root: __dirname + '/app' });
});

var server = app.listen(port, function() { 
  console.log('Listening on port %d', server.address().port); 
});