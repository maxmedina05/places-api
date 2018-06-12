const express = require("express");
const yelp = require("yelp-fusion");
const YELP_API_KEY = process.env.YELP_API_KEY;

function buildAddress(location) {
  return `${location.address1}, ${location.city}, ${location.state}, ${
    location.country
  }`;
}

function buildDescription(categories) {
  if (!categories) {
    return "";
  }

  const names = categories.map(c => c.title);
  return names.join(" - ");
}

module.exports = providerName => {
  const router = express.Router();
  const yelpClient = yelp.client(YELP_API_KEY);

  router.get("/", async (req, res, next) => {
    const { query, latitude, longitude, radius = 1000 } = req.query;
    try {
      if (typeof latitude === "undefined" || typeof longitude === "undefined") {
        throw new Error(
          "The latidude and/or longitude is missing or invalid ."
        );
      }

      const searchRequest = {
        term: query,
        latitude,
        longitude,
        radius
      };

      const response = (await yelpClient.search(searchRequest)).jsonBody;
      const businesses = response.businesses.map(b => ({
        id: b.id,
        provider: providerName,
        name: b.name,
        description: buildDescription(b.categories),
        location: {
          latitude: b.coordinates.latitude,
          longitude: b.coordinates.longitude
        },
        address: buildAddress(b.location),
        uri: b.url
      }));

      res.json({
        payload: businesses,
        total: businesses.length,
        error: false
      });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
