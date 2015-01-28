var factory = require('./factory');

module.exports = function(app) {

  // Show the main page
  app.get('/', function(request, response) {
    response.render('index');
  });

  // From the main page add a new stream by magnet link
  app.post('/add', function(request, response) {
    var link = request.body.link;

    console.log('Adding Stream for', link);
    factory.addMagnetLink(link, function(err, stream) {
      if(err) {
        request.session.msg = err;
        response.redirect('/');
      } else {
        response.redirect('/watch/'+stream.id);
      }
    });
  });

  // Video player
  app.get('/watch/:streamId', function(request, response) {
    var streamId = request.params.streamId;
      
    factory.getStream(streamId, function(err, stream) {
      if(err) {
        request.session.msg = err;
        response.redirect('/');
      } else {
        response.locals.stream = stream;
        response.render('watch');
      }
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
