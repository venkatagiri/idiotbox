var torrentStream = require('torrent-stream'),
  magnet = require('magnet-uri');

// Each stream is of below structure
//  - id: info hash from the magnet link to uniquely identify the stream
//  - magnetLink: the magnet link
//  - magnetInfo: parsed information from magnet link
//  - name: display name provided in magnet link
//  - createdDate: when the stream was created(TODO: clean engines running for more than a day)
//  - video: file which would be streamed

var STREAMABLE_FORMATS = /.mp4$|.mkv$/;
var MIME_TYPES = {
  'mp4': 'video/mp4',
  'mkv': 'video/mp4'
};

function stream(id, magnetLink) {
  this.id = id;
  this.magnetLink = magnetLink;
  this.magnetInfo = magnet(magnetLink);
  this.name = this.magnetInfo.name
  this.createdDate = new Date();
  this.video = null;
};

stream.prototype.start = function(cb) {
  var ts = torrentStream(this.magnetLink, { uploads: 0 });
  
  ts.on('ready', function() {
    console.log('Stream Engine ready for id:', this.id);
    
    // Largest file in the torrent is the video file
    var videoFile = ts.files[0];
    for(var i=1, len=ts.files.length; i < len; ++i) {
      if(ts.files[i].length > videoFile.length) {
        videoFile = ts.files[i];
      }
    }
    var extension = videoFile.name.split('.').pop();

    if(!videoFile.name.match(STREAMABLE_FORMATS)) {
      return cb('Couldn\'t find a video in the torrent. Please try again!');
    }

    this.video = {
      url: '/video/' + this.id,
      mimeType: MIME_TYPES[extension],
      file: videoFile
    };    
    console.log('Stream:', this.id, 'Video:', this.video.file.name);

    cb();
  }.bind(this));
};

stream.prototype.getVideo = function(cb) {
  // TODO: transcode video to webm/mp4
  cb(null, this.video);
};

module.exports = stream;
