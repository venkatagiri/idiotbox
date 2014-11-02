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
      
    response.locals.stream = factory.getStream(streamId);
    if(!response.locals.stream) {
      request.session.msg = 'Invalid request. Please try again!';
      response.redirect('/');
    } else {
      response.render('watch');
    }
  });

  // Streams the video
  app.get('/video/:streamId', function(request, response) {
    var streamId = request.params.streamId;

    var stream = factory.getStream(streamId);
    if(!stream) {
      request.session.msg = 'Invalid request. Please try again!';
      response.redirect('/');
    } else {
      stream.getVideoStream(function(err, videoStream) {
        if(err) {
          request.session.msg = err;
          response.redirect('/');
        } else {
          response.set('Content-Type', 'video/mp4'); // TODO: Get mimetype from video
          videoStream.pipe(response);
        }
      });
    }
  });
};
