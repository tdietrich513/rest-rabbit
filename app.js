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
          name: 'RMQServiceBus',
          uri: 'amqp://172.17.0.2:5672'
        }
      ]
    }
  }
});


var port = appEnv.port || 8081;
var api = require('amqplib/callback_api');
var rmquri = appEnv.getService('RMQServiceBus').uri;
var q = 'tasks';

var textParser = bodyParser.text();

function bail (err, res) {
  res.status(500).send(err);
}

app.post('/exchange/:exc/route/:rk', textParser, function(req, res) {
  let exchange = req.params.exc;
  let routeKey = req.params.rk;
  api.connect(rmquri, function(err, conn) {
    conn.createChannel(on_open);
    function on_open(err, ch) {
      if (err != null) bail(err, res);
      ch.assertExchange(exchange);
      ch.publish(exchange, routeKey, new Buffer(req.body));
      res.sendStatus(200);
      console.log(`published message to ${exchange} using routing key ${routeKey}`);
      ch.close();
    }
  });
});

function consumer(conn) {
  var ok = conn.createChannel(on_open);
  function on_open( err, ch) {
    if (err != null) bail (err);
    ch.assertQueue(q);
    ch.consume(q, function(msg) {
      if (msg !== null) {
        console.log(msg.content.toString());
        ch.ack(msg);
      }
    });
  }
}

api.connect(rmquri, function(err, conn) {
    consumer(conn);
  });

app.listen(port);
console.log(`listening on ${port}`);
