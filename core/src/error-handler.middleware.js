module.exports = (err, req, res, next) => {
  const error = {
    name: err.name,
    message: err.message
  };
  const now = new Date().toLocaleString();
  console.error(`[${now}] - ${error.name} - ${error.message}`);

  res.status(500).json({
    payload: [],
    error: error
  });
  next();
};
