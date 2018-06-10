/**
 * the collection storing the different providers
 */
var _providers = [];

/**
 * returns a copy of the providers
 */
function getProviders() {
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
