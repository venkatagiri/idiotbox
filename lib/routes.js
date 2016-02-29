var factory = require('./factory');
var feed = require('./feed');

module.exports = function(app) {

  // Show the main page
  app.get('/', function(request, response) {
    feed.fetchShowList(function(err, show_list) {
      response.locals.show_list = show_list;
      response.render('index');
    });
  });

  // Streams the video
  app.get('/video/:streamId', function(request, response) {
    var streamId = request.params.streamId;

    factory.getStream(streamId, function(err, stream) {
      if(err) {
        request.session.msg = err;
        response.redirect('/');
      } else {
        // TODO: transcode video to webm/mp4
        response.set('Content-Type', stream.video.mimeType);
        response.set('Content-Length', stream.video.length);
        stream.video.file.createReadStream().pipe(response);
      }
    });
  });

};
