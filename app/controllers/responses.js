exports.error = (err, res) => {
  res.status(500).send(err);
}

exports.ok = (res, message) => {
  if (message) return res.status(200).send(message);

  return res.sendStatus(200);
}
