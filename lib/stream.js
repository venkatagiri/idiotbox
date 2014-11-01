var torrentStream = require('torrent-stream'),
  magnet = require('magnet-uri'),
  crypto = require('crypto');

require('./utils');

// Each stream is of below structure
//  - id: info hash from the magnet link to uniquely identify the stream
//  - magnetLink: the magnet link
//  - magnetInfo: parsed information from magnet link
//  - name: display name provided in magnet link
//  - createdDate: when the stream was created(TODO: clean engines running for more than a day)
//  - files: map of filename hash to the file

function stream(id, magnetLink) {
  this.id = id;
  this.magnetLink = magnetLink;
  this.magnetInfo = magnet(magnetLink);
  this.name = this.magnetInfo.name
  this.createdDate = new Date();
  this.files = [];
};

stream.prototype.start = function(cb) {
  var ts = torrentStream(this.magnetLink, { uploads: 0 });
  
  ts.on('ready', function() {
    console.log('Stream Engine ready for id:', this.id);
    
    ts.files.forEach(function(file) {
      file.id = crypto.createHash('md5').update(file.name).digest('hex'); // Use filename hash as fileId
      this.files.push(file);
    }.bind(this));

    cb();
  }.bind(this));
};

stream.prototype.getVideoStream = function(fileId, cb) {
  var file = this.files.find(function(f) { return f.id === fileId; });

  if(!file) return cb('File not found. Try again!');

  cb(null, file.createReadStream());
};

module.exports = stream;
