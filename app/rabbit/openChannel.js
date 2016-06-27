var api = require('amqplib')
  , appEnv = require('cfenv').getAppEnv(require('./fallback'))
  , uri = appEnv.getService('RMQServiceBus').credentials.uri

var openChannel = api.connect(uri)
  .then((conn) => {
    return conn.createConfirmChannel()
  })
  .then((ch) => {
    return ch;
  })
  .catch(console.warn);

module.exports = openChannel;
