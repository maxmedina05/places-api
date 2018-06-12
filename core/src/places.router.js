const express = require("express");
const axios = require("axios");
const providerManager = require("./provider-manager");
const {
  NoProviderAvailableException,
  MissingOrInvalidParameter
} = require("./exceptions");
const router = express.Router();

function isParameterValid(parameter) {
  return typeof parameter !== "undefined" && parameter !== "";
}

/**
 * @swagger
 * /places:
 *   get:
 *     tags:
 *       - Places
 *     summary: search for all places in different providers subscribed.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: query
 *        in: query
 *        default: Pizza
 *        description: Text string on which to search. The service will return places matching this string.
 *        required: true
 *      - name: latitude
 *        in: query
 *        default: 37.786882
 *        description: Latitude of the location you want to search nearby.
 *        required: true
 *      - name: longitude
 *        in: query
 *        default: -122.399972
 *        description:  Longitude of the location you want to search nearby.
 *        required: true
 *      - name: radius
 *        in: query
 *        description: Radius of the location you want to search nearby in meters.
 *     responses:
 *       200:
 *         description: Return an object containing an array of places
 *         schema:
 *          $ref: '#/definitions/Response'
 *       400:
 *         description: Error
 */
router.get("/", async (req, res, next) => {
  const { query, latitude, longitude, radius = 1000 } = req.query;
  const providers = providerManager.getProviders();
  let places = [];
  let queryString = `query=${query}`;

  if (isParameterValid(latitude) && isParameterValid(longitude)) {
    queryString += `&latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
  }

  try {
    if (!isParameterValid(query)) {
      throw new MissingOrInvalidParameter("query");
    }

    if (!providers || providers.length === 0) {
      throw new NoProviderAvailableException();
    }

    for (const provider of providers) {
      const endpoint = `${provider.url}?${queryString}`;
      const response = (await axios.get(endpoint)).data;
      const payload = response.payload;
      places = [...places, ...payload];
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

module.exports = router;
