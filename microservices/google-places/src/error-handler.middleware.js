module.exports = sendErrorMessage => {
  return (err, req, res, next) => {
    const error = {
      name: err.name,
      message: err.message
    };

    sendErrorMessage(error);

    res.json({
      payload: [],
      error: error
    });
    next();
  };
};
