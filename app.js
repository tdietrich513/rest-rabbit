var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var appEnv = require('cfenv').getAppEnv({
  vcap: {
    application: {

    },
    services: {
      'p-rabbitmq': [
        {
          credentials: {
            name: 'RMQServiceBus',
            uri: 'amqp://172.17.0.2:5672'
          }
        }
      ]
    }
  }
});


var port = appEnv.port || 8081;
var api = require('amqplib/callback_api');
var rmquri = appEnv.getService('RMQServiceBus').credentials.uri;
console.log(`attaching to rabbit at uri ${rmquri}`);
var textParser = bodyParser.text();

function bail (err, res) {
  res.status(500).send(err);
}

app.post('/exchange/:exc/route/:rk', textParser, (req, res) => {
  let exchange = req.params.exc;
  let routeKey = req.params.rk;
  api.connect(rmquri, (err, conn) => {
    conn.createChannel((err, ch) => {
      if (err != null) bail(err, res);
      ch.assertExchange(exchange);
      ch.publish(exchange, routeKey, new Buffer(req.body));
      res.sendStatus(200);
      console.log(`published message to ${exchange} using routing key ${routeKey}`);
      ch.close();
    });    
  });
});

app.listen(port);
console.log(`listening on ${port}`);
