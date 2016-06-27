exports.error = (err, res) => {
  res.status(500).send(err);
}

exports.ok = (res, message) => {
  if (message) {
    res.status(200).send(message);
  } else  {
    res.sendStatus(200);
  }
}
