const express = require("express");
const router = express.Router();
const axios = require("axios");
const {
  RequestDeniedException,
  ZeroResultsException,
  InvalidRequestException,
  OverQueryLimitException,
  UnknownErrorException
} = require("./exceptions");

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_ENDPOINT =
  "https://maps.googleapis.com/maps/api/place/nearbysearch";
const GOOGLE_PLACES_DETAILS_ENDPOINT =
  "https://maps.googleapis.com/maps/api/place/details";

/**
 * returns a list of places.
 * Note: the description of each place is taken from the types fields
 * because Google Places doesn't provide a description field and the
 * types array contains different labels that decribe the returned place.
 *
 * @param {string} providerName
 * @param {result[]} results
 */
function buildPlacesList(providerName, results) {
  return results.map(r => ({
    id: r.place_id,
    provider: providerName,
    name: r.name,
    description: r.types.join(" - "),
    location: {
      latitude: r.geometry.location.lat,
      longitude: r.geometry.location.lng
    },
    address: r.vicinity,
    uri: `${GOOGLE_PLACES_DETAILS_ENDPOINT}/json?placeid=${
      r.place_id
    }&key=${GOOGLE_PLACES_API_KEY}`
  }));
}

function throwStatusError(status) {
  switch (status) {
    case "REQUEST_DENIED":
      throw new RequestDeniedException();
      break;
    case "ZERO_RESULTS":
      throw new ZeroResultsException();
      break;
    case "INVALID_REQUEST":
      throw new InvalidRequestException();
      break;
    case "OVER_QUERY_LIMIT":
      throw new OverQueryLimitException();
      break;
    default:
      throw new UnknownErrorException();
  }
}

module.exports = providerName => {
  router.get("/", async (req, res, next) => {
    const { query, latitude, longitude, radius = 1000 } = req.query;
    const endpoint = `${GOOGLE_PLACES_ENDPOINT}/json?keyword=${query}&key=${GOOGLE_PLACES_API_KEY}&location=${latitude},${longitude}&radius=${radius}`;

    try {
      const { results, status } = (await axios.get(endpoint)).data;
      if (status === "OK") {
        const places = buildPlacesList(providerName, results);

        res.json({
          payload: places,
          error: false
        });
      } else {
        throwStatusError(status);
      }
    } catch (err) {
      next(err);
    }
  });

  return router;
};
