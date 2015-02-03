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
    newStream.start(function(err) {
      if(err) {
        return cb(err);
      }

      streams[streamId] = newStream;
      cb(null, newStream);
    });
  },
  getStream: function(streamId, cb) {
    if(streams[streamId]) {
      return cb(null, streams[streamId]);
    }
    
    var magnetLink = 'magnet:?' + [
      'xt=urn:btih:'+streamId,
      'tr=udp://tracker.openbittorrent.com:80',
      'tr=udp://tracker.publicbt.com:80',
      'tr=udp://tracker.istole.it:80',
      'tr=http://tracker.istole.it',
      'tr=http://fr33dom.h33t.com:3310/announce',
      'tr=udp://open.demonii.com:1337'
    ].join('&');
    
    this.addMagnetLink(magnetLink, cb);
  }
};

module.exports = factory;
