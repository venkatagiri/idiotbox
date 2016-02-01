module.exports = {
  // Save directory for the torrents
  savePath: process.env['HOME'] + '/.idiotbox',

  // ShowRSS URL
  showrss_url: process.env['SHOWRSS_URL'] || 'http://showrss.info/rss.php?user_id=207031&hd=0&proper=0',

  // Server Port
  port: process.env.PORT || 8080
};
