var express = require('express')
  , router = express.Router()
  , textParser = require('body-parser').text()
  , responses = require ('./responses')
  , publishMessage = require('../rabbit/publishMessage')

router.post('/:exc/route/:rk', textParser, (req, res) => {
  let exchange = req.params.exc;
  let routeKey = req.params.rk;

  publishMessage(exchange, routeKey, new Buffer(req.body), (err) => {
    if (err) return responses.error(err, res)

    let message = `published message to ${exchange} using routing key ${routeKey}`;
    console.log(message);
    return responses.ok(res, message);
  });
});

module.exports = router
