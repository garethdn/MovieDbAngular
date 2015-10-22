(function() {
  'use strict';

  /* global process:false, require:false, __dirname:false, console:false */
  var port = Number(process.env.PORT || 8000);
  var express = require('express');
  var requestPromise = require('request-promise');
  var request = require('request');
  var bodyParser = require('body-parser');
  var torrentHelper = require('./server/torrent_helper.js');
  var prettyjson = require('prettyjson');
  var _ = require('lodash');
  var compress = require('compression');
  var rangeParser = require('range-parser');

  var app = express();

  app.use(compress());
  app.set('etag', 'strong');

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
    requestPromise({
      method : req.method,
      uri : mdbUrl + req.url,
      qs : { api_key: process.env.MOVIE_DB_API_KEY },
      body: req.body,
      json: true
    }).then(function(movie) {
      res.send(movie);
    }, function(response){
      res.status(response.statusCode).send(response.error);
    });
  });

  app.use('/play-torrent/:torrentIdentifier', function(req, res, next) {
    // Returns a singleton instance based on the torrentIdentifier
    var torrent = torrentHelper.getTorrentStream(req.params.torrentIdentifier);

    // If the torrent file already exists, pipe it to the client
    if (torrent.file) {
      if (!req.headers.range) {
        return torrentHelper.rangeHeaderNotPresent(res, torrent);
      }
      torrentHelper.download(req, res, torrent.file).pipe(res);
    } else {
      // Otherwise wait until the engine is ready to access the files
      // then stream to the client
      torrent.engine.on('ready', function(){
        console.log('Engine ready');

        torrent.file = torrentHelper.getTorrentVideoFile(torrent.engine);

        if (!req.headers.range) {
          return torrentHelper.rangeHeaderNotPresent(res, torrent);
        }

        return torrentHelper.download(req, res, torrent.file).pipe(res);
      });
    }

    res.on('data', function(chunk){
      console.log('Stream data event with a chunksize of ' + chunk.length / 1000000 + 'MBs');
    });
  });

  app.use('/play-test/:hash', function(req, res, next) {
    var fileUrl = 'https://ia800300.us.archive.org/1/items/night_of_the_living_dead/night_of_the_living_dead_512kb.mp4';

    console.log('Raw range: ', req.headers.range);

    var range = req.headers.range;

    if (!range) {
      range = "bytes=0-6000000";
    }

    var positions, start, end, total, chunksize;

    request({
      url: fileUrl,
      method: 'HEAD'
    }, function(error, response, body){
      setResponseHeaders(response.headers);
      pipeToResponse();
    });

    function setResponseHeaders(headers){
      positions = range.replace(/bytes=/, "").split("-");
      start = parseInt(positions[0], 10); 
      total = headers['content-length'];
      end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      chunksize = (end-start)+1;

      res.writeHead(206, { 
        "Content-Range": "bytes " + start + "-" + end + "/" + total, 
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type":"video/mp4"
      });
    }

    function pipeToResponse() {
      var options = {
        url: fileUrl,
        headers: {
          range: "bytes=" + start + "-" + end,
          connection: 'keep-alive'
        }
      };

      request(options).pipe(res);
    }

  });

  app.get('/*', function(req, res, next) {
    res.sendFile('index.html', { root: __dirname + '/app' });
  });

  var server = app.listen(port, function() { 
    console.log('Listening on port %d', server.address().port); 
  });

})();