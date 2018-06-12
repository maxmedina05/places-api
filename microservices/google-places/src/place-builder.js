/**
 * returns a Place
 * Note: the description of each place is taken from the types fields
 * because Google Places doesn't provide a description field and the
 * types array contains different labels that decribe the returned place.
 * @param {object} googlePlace
 * @param {string} providerName
 * @param {string} uri
 */
function buildPlace(googlePlace, providerName, uri) {
  const address = googlePlace.vicinity
    ? googlePlace.vicinity
    : googlePlace.formatted_address;

  let place = {
    id: googlePlace.place_id,
    provider: providerName,
    name: googlePlace.name,
    description: googlePlace.types.join(" - "),
    location: {
      latitude: googlePlace.geometry.location.lat,
      longitude: googlePlace.geometry.location.lng
    },
    address: address,
    uri
  };

  return place;
}

/**
 * returns an array of places
 * @param {object[]} results
 * @param {string} providerName
 * @param {function} uriBuilder
 */
function buildListOfPlaces(results, providerName, uriBuilder) {
  return results.map(r => buildPlace(r, providerName, uriBuilder(r)));
}

module.exports = {
  buildPlace,
  buildListOfPlaces
};
