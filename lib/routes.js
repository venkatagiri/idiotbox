var factory = require('./factory');

module.exports = function(app) {

  // Show the main page
  app.get('/', function(request, response) {
    response.render('index');
  });

  // From the main page add a new stream by magnet link
  app.post('/stream/add', function(request, response) {
    var link = request.body.link;

    console.log('Stream Add for ', link);
    factory.addMagnetLink(link, function(err, stream) {
      response.redirect('/stream/'+stream.id);
    });
  });

  // Stream page. Shows list of files available
  app.get('/stream/:streamId', function(request, response) {
    var streamId = request.params.streamId;
      
    response.locals.stream = factory.getStream(streamId);
    if(!response.locals.stream) {
      request.session.msg = 'Invalid stream. Try again!';
      response.redirect('/');
    } else {
      response.render('stream');
    }
  });

  // File page which streams the video.
  app.get('/stream/:streamId/file/:fileId', function(request, response) {
    var streamId = request.params.streamId,
      fileId = request.params.fileId;

    var stream = factory.getStream(streamId);
    if(!stream) {
      request.session.msg = 'Invalid stream. Try again!';
      response.redirect('/');
    } else {
      stream.getVideoStream(fileId, function(err, videoStream) {
        if(err) {
          request.session.msg = err;
          response.redirect('/stream/'+streamId);
        } else {
          response.set('Content-Type', 'video/mp4');
          videoStream.pipe(response);
        }
      });
    }
  });
};
