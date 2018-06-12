const { NoProviderAvailableException } = require("./exceptions");
/**
 * the collection storing the different providers
 * This is a Singleton
 */
var _providers = [];

/**
 * returns a copy of the providers
 */
function getProviders() {
  if (!_providers || _providers.length === 0) {
    throw new NoProviderAvailableException();
  }

  return _providers.slice();
}

/**
 * assigns the providers property
 * @param {Array} providers
 */
function setProviders(providers) {
  _providers = providers;
}

module.exports = {
  getProviders,
  setProviders
};
