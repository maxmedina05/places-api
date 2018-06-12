const express = require("express");
const axios = require("axios");

const router = express.Router();

const {
  RequestDeniedException,
  ZeroResultsException,
  InvalidRequestException,
  OverQueryLimitException,
  UnknownErrorException
} = require("./exceptions");

const { buildListOfPlaces } = require("./place-builder");

// this is an expression that builds the uri
const uriBuilder = googlePlace =>
  `${GOOGLE_PLACES_DETAILS_ENDPOINT}/json?placeid=${
    googlePlace.place_id
  }&key=${GOOGLE_PLACES_API_KEY}`;

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_NEARBY_SEARCH_ENDPOINT =
  "https://maps.googleapis.com/maps/api/place/nearbysearch";
const GOOGLE_PLACES_SEARCH_BY_TEXT_ENDPOINT =
  "https://maps.googleapis.com/maps/api/place/textsearch";
const GOOGLE_PLACES_DETAILS_ENDPOINT =
  "https://maps.googleapis.com/maps/api/place/details";

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

async function searchbyLocation(
  providerName,
  query,
  latitude,
  longitude,
  radius
) {
  const endpoint = `${GOOGLE_PLACES_NEARBY_SEARCH_ENDPOINT}/json?keyword=${query}&key=${GOOGLE_PLACES_API_KEY}&location=${latitude},${longitude}&radius=${radius}`;
  const { results, status } = (await axios.get(endpoint)).data;

  if (status === "OK") {
    const places = buildListOfPlaces(results, providerName, uriBuilder);
    return places;
  }

  throwStatusError(status);
}

async function searchByText(providerName, query) {
  const endpoint = `${GOOGLE_PLACES_SEARCH_BY_TEXT_ENDPOINT}/json?query=${query}&key=${GOOGLE_PLACES_API_KEY}`;
  const { results, status } = (await axios.get(endpoint)).data;

  if (status === "OK") {
    const places = buildListOfPlaces(results, providerName, uriBuilder);
    return places;
  }

  throwStatusError(status);
}

module.exports = providerName => {
  router.get("/", async (req, res, next) => {
    const { query, latitude, longitude, radius = 1000 } = req.query;
    try {
      let places = [];
      if (typeof latitude === "undefined" || typeof longitude === "undefined") {
        places = await searchByText(providerName, query);
      } else {
        places = await searchbyLocation(
          providerName,
          query,
          latitude,
          longitude,
          radius
        );
      }

      res.json({
        total: places.length,
        error: false,
        payload: places
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
};
