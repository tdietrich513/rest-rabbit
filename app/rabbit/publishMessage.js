var openChannel = require('./openChannel')

var publishMessage = (exchange, route, body, callback) => {
  openChannel.then((channel) => {
    channel.publish(exchange, route, body);
    channel.waitForConfirms().then((confirms) => {
      confirms.forEach(err => {
        if (err) {
          callback(err);
          return;
        }
      });

      callback();
    });
  });
}

module.exports = publishMessage;
