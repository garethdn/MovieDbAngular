/* globals module, require, console */
(function() {
  'use strict';

  var torrentStream = require('torrent-stream');
  var _ = require('lodash');
  var prettyjson = require('prettyjson');

  module.exports = {
    getTorrentStream: getTorrentStream,
    getTorrentVideoFile: getTorrentVideoFile,
    getStreamMetadata: getStreamMetadata,
    download: download,
    write206Headers: write206Headers,
    rangeHeaderNotPresent: rangeHeaderNotPresent
  };

  var uploadCounter = 0;
  var downloadCounter = 0;
  var torrentStreams = {};
  var maxBuffer = 5000000; // 5MB

  function getTorrentStream(hash) {
    if (torrentStreams[hash]) {
      console.log('Already have engine instance for torrent');

      return torrentStreams[hash];
    } else {
      console.log('Engine instance not found, creating....');

      destroyCurrentEngines();

      torrentStreams[hash] = {
        engine: torrentStream(hash, {
          // uploads: 5,
          trackers: getTrackers()
        })
      };

      torrentStreams[hash].engine.on('download', onPieceDownload);
      torrentStreams[hash].engine.on('idle', onEngineIdle);
      torrentStreams[hash].engine.on('upload', onPieceUpload);

      return torrentStreams[hash];
    }
  }

  function getTorrentVideoFile(engine) {
    var mp4Files = _.filter(engine.files, function(file){
      return _.last(file.name.split('.')) === 'mp4';
    });

    return _.chain(mp4Files).sortBy('-length').value()[0];
  }

  function getStreamMetadata(req, file) {
    var requestedRange = req.headers.range;
    var positions = requestedRange ? requestedRange.replace(/bytes=/, "").split("-") : [0, maxBuffer];
    var start = parseInt(positions[0], 10);
    var total = file.length;

    if (_.isNaN(start)) {
      console.log("Whoops, start isn't a number - setting as 0");
      start = 0;
    }

    var end = parseInt(getByteRangeEnd(start, positions[1], total), 10);
    // var end = positions[1] ? parseInt(positions[1], 10) : (start + maxBuffer) > (total - 1) ? (total - 1) : (start + maxBuffer);
    var chunksize = (end - start) + 1;

    return {
      start: start,
      end: end,
      total: total,
      chunksize: chunksize
    };
  }

  function getTrackers() {
    return [
      "udp://open.demonii.com:1337",
      "udp://tracker.istole.it:80",
      "http://tracker.yify-torrents.com/announce",
      "udp://tracker.publicbt.com:80",
      "udp://tracker.openbittorrent.com:80",
      "udp://tracker.coppersurfer.tk:6969",
      "udp://exodus.desync.com:6969",
      "http://exodus.desync.com:6969/announce"
    ];
  }

  function download(req, res, file) {
    console.log('In download method');
    // Get ranges, size, chunksize
    var streamMetadata = getStreamMetadata(req, file);

    // Write partial HTTP 206 response with headers
    write206Headers(res, streamMetadata);

    // Return pipeable read stream
    var stream = file.createReadStream({
      start: streamMetadata.start,
      // TESTING: read an extra `maxBuffer` amount of data from the torrent file
      end: (streamMetadata.end + maxBuffer)
    });

    console.log('About to download torrent bytes ' + streamMetadata.start + ' to ' + (streamMetadata.end + maxBuffer));

    return stream;
  }

  function onPieceDownload(pieceIndex, buffer){
    console.log('⬇⬇ Downloaded piece index: ', pieceIndex);

    downloadCounter += buffer.length / 1000000;

    if (downloadCounter >= maxBuffer / 1000000) {
      console.log('Downloaded ' + downloadCounter + ' MBs');
      downloadCounter = 0;
    }
  }

  function onPieceUpload(pieceIndex, offset, length) {
    uploadCounter ++;

    if (uploadCounter >= 100) {
      // console.log('⬆⬆ 100 pieces uploaded, last piece had a size of ' + length);
      uploadCounter = 0;
    }
  }

  function onEngineIdle() {
    console.log('Engine is idle...');
  }

  function write206Headers(res, metadata) {
    res.writeHead(206, {
      "Content-Range": "bytes " + metadata.start + "-" + metadata.end + "/" + metadata.total,
      "Connection": "keep-alive",
      "Accept-Ranges": "bytes",
      "Content-Length": metadata.chunksize,
      "Content-Type": "video/mp4"
    });

    console.log('RESPONSE Content Range: ', "bytes " + metadata.start + "-" + metadata.end + "/" + metadata.total);
    console.log('RESPONSE Content Length: ', metadata.chunksize);
  }

  function destroyCurrentEngines() {
    _.each(torrentStreams, function(stream){
      stream.engine.destroy(function(){
        console.log('Engine for ' + stream.file.name + ' destroyed');
      });
    });
  }

  function rangeHeaderNotPresent(res, torrent) {
    console.log('No range requested');
    console.log('------------------');

    res.writeHead(200, {
      "Accept-Ranges": "bytes",
      "Content-Type": "video/mp4",
      "Content-Length": torrent.file.length,
      "Connection": 'keep-alive'
    });

    return res.send();
  }

  function getByteRangeEnd(requestedStart, requestedEnd, total) {
    var range = {
      start: requestedStart,
      end: requestedEnd
    };

    if (!requestedEnd || (requestedEnd - range.start >= maxBuffer) ) {
      range.end = (range.start + maxBuffer) > (total - 1) ? (total - 1) : (range.start + maxBuffer);
    }

    return range.end;
  }
  
})();