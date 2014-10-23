var torrentStream = require('torrent-stream');

var engine = torrentStream('magnet:?xt=urn:btih:ef4aecee43c5fa26e85ad07254478a725ec39e2b&dn=Gotham+S01E03+HDTV+x264-LOL%5Bettv%5D&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.istole.it%3A6969&tr=udp%3A%2F%2Fopen.demonii.com%3A1337');
//var engine = torrentStream('magnet:?xt=urn:ed2k:31D6CFE0D16AE931B73C59D7E0C089C0&xl=0&dn=zero_len.fil&xt=urn:bitprint:3I42H3S6NNFQ2MSVX7XZKYAYSCX5QBYJ.LWPNACQDBZRYXW3VHJVCJ64QBZNGHOHHHZWCLNQ&xt=urn:md5:D41D8CD98F00B204E9800998ECF8427E');

engine.on('ready', function() {
	console.log('engine ready!');
});
module.exports = function(app) {

  // Everything happens at the index page.
  app.get('/', function(request, response) {
    engine.files.forEach(function(file) {
      console.log('filename:', file.name);
			if(file.name == 'gotham.103.hdtv-lol.mp4') {
				console.log('streaming gotham.103.hdtv-lol.mp4');
	      var stream = file.createReadStream();
response.set('Content-Type', 'video/mp4');
				stream.pipe(response);
			}
    });
  });

};
