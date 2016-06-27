var express = require('express')
  , router = express.Router()
  , textParser = require('body-parser').text()
  , responses = require ('./responses')
  , publishMessage = require('../rabbit/publishMessage')

router.post('/:exc/route/:rk', textParser, (req, res) => {
    let exchange = req.params.exc;
    let routeKey = req.params.rk;

    publishMessage(exchange, routeKey, new Buffer(req.body), (err) => {
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
