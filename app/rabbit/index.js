var api = require('amqplib')
  , appEnv = require('cfenv').getAppEnv(require('./fallback'))
  , uri = appEnv.getService('RMQServiceBus').credentials.uri

var getChannel = api.connect(uri)
  .then((conn) => {
    return conn.createConfirmChannel()
  })
  .then((ch) => {
    return ch;
  })
  .catch(console.warn);

module.exports.publishMessage = (exchange, route, body, callback) => {
  getChannel.then((channel) => {
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
