const express = require("express");
const axios = require("axios");
const providerManager = require("./provider-manager");

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
 *     responses:
 *       200:
 *         description: Return an array of places
 *         schema:
 *          $ref: '#/definitions/Response'
 *       400:
 *         description: Error
 */
router.get("/", async (req, res) => {
  const { query, latitude, longitude, radius = 1500 } = req.query;
  let places = [];

  for (const provider of providerManager.getProviders()) {
    const response = (await axios.get(
      `${
        provider.url
      }?query=${query}&latitude=${latitude}&longitude=${longitude}&radius=${radius}`
    )).data;

    const payload = response.payload;
    places = [...places, ...payload];
  }

  res.json(places);
});

module.exports = router;
