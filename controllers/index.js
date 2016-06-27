var express = require('express')
  , router = express.Router()

router.use('/exchange', require('./exchange'));

module.exports = router;
