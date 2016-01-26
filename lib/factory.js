var stream = require('./stream'),
  magnet = require('magnet-uri'),
  config = require('./config'),
  fs = require('fs');

// List of torrent streams
var streams = {};

var factory = {
  initialize: function() {
    if(!fs.existsSync(config.savePath + '/torrent-stream')) fs.mkdirSync(config.savePath + '/torrent-stream');
    
    var dirlist = fs.readdirSync(config.savePath + '/torrent-stream');
    dirlist.map(function(el) {
      if(!el.match(/.torrent$/)) return;
      
      var hash = el.split('.').shift();
      
      factory.getStream(hash, function noop(){});
    });

    //setInterval(this.cleanup.bind(this), 60 * 60 * 1000);
  },
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
      'tr=udp://tracker.coppersurfer.tk:6969/announce',
      'tr=udp://tracker.leechers-paradise.org:6969',
      'tr=udp://open.demonii.com:1337'
    ].join('&');
    
    this.addMagnetLink(magnetLink, cb);
  }
};

factory.initialize();

module.exports = factory;
