module.exports = {
  // Used for redirection in app
  mountPath: process.env.MOUNT_PATH || '/',

  // Server Port
  port: process.env.PORT || 8080
};
