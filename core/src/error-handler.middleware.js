module.exports = (err, req, res, next) => {
  console.error(err);
  const error = {
    name: err.name,
    message: err.message
  };

  res.status(500).json({
    payload: [],
    error: error
  });
  next();
};
