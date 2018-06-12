class RequestDeniedException extends Error {
  constructor(...args) {
    super(...args);
    this.name = "REQUEST_DENIED";
    this.message = "The API key is missing or is invalid.";
    Error.captureStackTrace(this, RequestDeniedException);
  }
}

class ZeroResultsException extends Error {
  constructor(...args) {
    super(...args);
    this.name = "ZERO_RESULTS";
    this.message =
      "The request was successful but no results were returned. The latitude and/or longitude is invalid.";
    Error.captureStackTrace(this, ZeroResultsException);
  }
}

class InvalidRequestException extends Error {
  constructor(...args) {
    super(...args);
    this.name = "INVALID_REQUEST";
    this.message = "The location or radius missing or invalid.";
    Error.captureStackTrace(this, InvalidRequestException);
  }
}

class OverQueryLimitException extends Error {
  constructor(...args) {
    super(...args);
    this.name = "OVER_QUERY_LIMIT";
    this.message = "The qouta limit of request was exceeded.";
    Error.captureStackTrace(this, InvalidRequestException);
  }
}

class UnknownErrorException extends Error {
  constructor(...args) {
    super(...args);
    this.name = "UNKNOWN_ERROR";
    this.message = "Something happened; trying again may be successful.";
    Error.captureStackTrace(this, UnknownErrorException);
  }
}

module.exports = {
  RequestDeniedException,
  ZeroResultsException,
  InvalidRequestException,
  OverQueryLimitException,
  UnknownErrorException
};
