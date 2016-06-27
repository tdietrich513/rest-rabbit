var express = require('express')
  , router = express.Router()
  , textParser = require('body-parser').text()
  , responses = require ('./responses')
  , rabbit = require('../rabbit')

router.post('/:exc/route/:rk', textParser, (req, res) => {
    let exchange = req.params.exc;
    let routeKey = req.params.rk;

    rabbit.publishMessage(exchange, routeKey, new Buffer(req.body), (err) => {
      if (err) {
        responses.error(err, res)
      } else {
        let message = `published message to ${exchange} using routing key ${routeKey}`;

        responses.ok(res, message);
        console.log(message);
      }
    });

  });

module.exports = router
