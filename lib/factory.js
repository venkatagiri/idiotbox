var stream = require('./stream'),
  magnet = require('magnet-uri');

// List of torrent streams
var streams = {};

var factory = {
  addMagnetLink: function(link, cb) {
    var streamId = magnet(link).infoHash;

    // If the torrent stream already exists, return the same.
    if(streams[streamId]) {
      return cb(null, streams[streamId]);
    }

    // Else create a new stream.
    var newStream = new stream(streamId, link);
    newStream.start(function() {
      streams[streamId] = newStream;
      cb(null, newStream);
    });
  },
  getStream: function(streamId) {
    return streams[streamId];
  }
};

module.exports = factory;
