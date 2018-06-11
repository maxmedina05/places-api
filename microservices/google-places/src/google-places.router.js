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

function buildPlacesList(results) {
  return results.map(r => ({
    id: r.place_id,
    provider: "Google Places",
    name: r.name,
    description: "",
    location: {
      latitude: r.geometry.location.lat,
      longitude: r.geometry.location.lng
    },
    address: r.vicinity,
    uri: ""
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

router.get("/", async (req, res, next) => {
  const { query, latitude, longitude, radius = 1500 } = req.query;
  const endpoint = `${GOOGLE_PLACES_ENDPOINT}/json?keyword=${query}&key=${GOOGLE_PLACES_API_KEY}&location=${latitude},${longitude}&radius=${radius}`;

  try {
    const { results, status } = (await axios.get(endpoint)).data;
    if (status === "OK") {
      const places = buildPlacesList(results);

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

module.exports = router;
