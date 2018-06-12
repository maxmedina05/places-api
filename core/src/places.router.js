const express = require("express");
const axios = require("axios");
const providerManager = require("./provider-manager");
const { NoProviderAvailableException } = require("./exceptions");
const router = express.Router();

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
 *        description: Text string on which to search. The service will return places matching this string
 *        required: true
 *      - name: latitude
 *        in: query
 *        description: Latitude of the location you want to search nearby.
 *        required: true
 *      - name: longitude
 *        in: query
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

  try {
    if (!providers || providers.length === 0) {
      throw new NoProviderAvailableException();
    }

    for (const provider of providers) {
      const response = (await axios.get(
        `${
          provider.url
        }?query=${query}&latitude=${latitude}&longitude=${longitude}&radius=${radius}`
      )).data;

      const payload = response.payload;
      places = [...places, ...payload];
    }

    res.json({
      payload: places,
      error: false
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
