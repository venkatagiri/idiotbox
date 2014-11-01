var express = require('express'),
  app = express(),
  config = require('./config'),
  routes = require('./routes');

// Configurations
app.configure(function() {
  // Use X-Forwarded-For as req and res ips.
  app.enable('trust proxy');

  // Logger.
  app.use(function(request, response, next) {
    console.log('[%s] [%s] %s %s', Date(), request.ip, request.method, request.url);
    next();
  });

  // To enable CORS, i.e. enabling cross-domain AJAX requests.
  app.use(function(request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  // Use EJS.
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/../views');

  // Serve static content from public.
  app.use(express.static(__dirname + '/../public'));

  // Parses POST requests as parameters.
  app.use(express.json());
  app.use(express.urlencoded());
  
  // Enable sessions.
  app.use(express.cookieParser('shhhh, very secret'));
  app.use(express.session('shhhh, very secret'));

  // Load error/notification messages from the session
  app.use(function(request, response, next) {
    response.locals.msg = request.session.msg;
    delete request.session.msg;
    next();
  });

  // Load the routes
  routes(app);
});

// Wrapper to start the server.
app.start = function() {
  this.listen(config.port, function() {
    console.log('Listening on port', config.port);
  });
};

module.exports = app;
