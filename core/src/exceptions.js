class NoProviderAvailableException extends Error {
  constructor(...args) {
    super(...args);
    this.name = "NO_PROVIDER_AVAILABLE";
    this.message =
      "Sorry, there aren't any providers subscribed at the moment. Please try later.";
    Error.captureStackTrace(this, NoProviderAvailableException);
  }
}

class MissingOrInvalidParameter extends Error {
  constructor(parameterName, ...args) {
    super(...args);
    this.name = "MISSING_OR_INVALID_PARAMETER";
    this.message = `$The ${parameterName} parameter is missing or invalid.`;
    Error.captureStackTrace(this, MissingOrInvalidParameter);
  }
}

module.exports = {
  NoProviderAvailableException,
  MissingOrInvalidParameter
};
