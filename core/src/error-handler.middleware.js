module.exports = (err, req, res, next) => {
  console.error(err);
  const error = {
    name: err.name,
    message: err.message
  };

  res.json({
    payload: [],
    error: error
  });
  next();
};
