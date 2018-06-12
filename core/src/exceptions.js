class NoProviderAvailableException extends Error {
  constructor(...args) {
    super(...args);
    this.name = "NO_PROVIDER_AVAILABLE";
    this.message =
      "Sorry, there aren't any providers subscribed at the moment. Please try later.";
    Error.captureStackTrace(this, NoProviderAvailableException);
  }
}

module.exports = {
  NoProviderAvailableException
};
