(function() {
  'use strict';

  /* global process:false, require:false, __dirname:false, console:false */
  var port = Number(process.env.PORT || 8000);
  var express = require('express');
  var request = require('request');
  var bodyParser = require('body-parser');
  var app = express();

  if (!process.env.MOVIE_DB_API_KEY) {
    process.env.MOVIE_DB_API_KEY = require('./private.js').mdbApiKey;
  }

  var mdbUrl = 'https://api.themoviedb.org/3';

  app.use(bodyParser.json()); // for parsing application/json

  app.use('/', express.static('app'));
  app.use('/bower_components', express.static(__dirname + '/bower_components'));
  app.use('/node_modules', express.static(__dirname + '/node_modules'));
  app.use('/dist', express.static(__dirname + '/dist'));

  // Middleware to intercept API calls and append the api key, 
  // forward the request to the API and return the response
  app.use('/api/v3', function(req, res, next) {
    console.log('API request', mdbUrl + req.url);
    console.log('Request method', req.method);
    console.log('Request body', req.body);

    request({
      method : req.method,
      uri : mdbUrl + req.url,
      qs : {
        api_key: process.env.MOVIE_DB_API_KEY
      },
      json: req.body
    }, function(error, response, body) {
      res.status(response.statusCode).send(body);
    });
  });

  app.get('/*', function(req, res, next) {
    res.sendFile('index.html', { root: __dirname + '/app' });
  });

  var server = app.listen(port, function() { 
    console.log('Listening on port %d', server.address().port); 
  });

})();