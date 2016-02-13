var feedRead = require('feed-read');
var config = require('./config');
var magnet = require('magnet-uri');
var jsonfile = require('jsonfile');
var fs = require('fs');

var shows_file = config.savePath + '/saved_shows.json';

var feed = {
  savedShows: function() {
    if(!fs.existsSync(shows_file)) jsonfile.writeFileSync(shows_file, {});

    return jsonfile.readFileSync(shows_file);
  },

  fetchShowList: function(callback) {
    var savedShowList = this.savedShows();

    this.get(savedShowList, function(err, list) {
      jsonfile.writeFileSync(shows_file, list);
      callback(err, list);
    });
  },

  get: function(list, callback) {
    feedRead(config.showrss_url, function(err, items) {
      if(err) return callback(err);

      items.forEach(function(item) {
        var show_parts = item.title.match(/(.*) (\d+x\d+) ?(.*)?/);

        var show_name = show_parts[1];
        var episode_number = show_parts[2];
        var episode_title = show_parts[3];

        list[show_name] = list[show_name] || {};

        list[show_name][episode_number] = list[show_name][episode_number] || {
          title: episode_title || 'Untitled',
          hash: magnet(item.link).infoHash
        };
      });

      callback(null, list);
    });
  }
};

module.exports = feed ;
