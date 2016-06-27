var express = require('express')
  , app = express()
  , port = require('cfenv').getAppEnv().port;

app.use(require('./controllers'));

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
