var feedRead = require('feed-read');
var config = require('./config');
var magnet = require('magnet-uri');

var feed = {
  get: function(callback) {
    feedRead(config.showrss_url, function(err, items) {
      if(err) return callback(err);

      var list = {};
      items.forEach(function(item) {
        var show_parts = item.title.match(/(.*) (\d+x\d+) ?(.*)?/);

        list[show_parts[1]] = list[show_parts[1]] || [];

        list[show_parts[1]].push({
          number: show_parts[2],
          title: show_parts[3] || 'Untitled',
          hash: magnet(item.link).infoHash
        });
      });

      callback(null, list);
    });
  }
};

module.exports = feed ;
