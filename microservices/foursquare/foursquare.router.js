const express = require("express");
var request = require("request-promise");
const FOURSQUARE_CLIENT_ID = process.env.FOURSQUARE_CLIENT_ID;
const FOURSQUARE_CLIENT_SECRET = process.env.FOURSQUARE_CLIENT_SECRET;
const FOURSQUARE_API_ENDPOINT = "https://api.foursquare.com/v2/venues/search";
const FOURSQUARE_DETAILS_API_ENDPOINT = "https://api.foursquare.com/v2/venues";
const FOURSQUARE_VERSION = "20180323";
const FOURSQUARE_LIMIT = 10;

function buildDescription(categories) {
  if (!categories) {
    return "";
  }
  const names = categories.map(x => x.name);
  return names.join(" - ");
}

function buildURI(venue) {
  return `${FOURSQUARE_DETAILS_API_ENDPOINT}/${
    venue.id
  }/?client_id=${FOURSQUARE_CLIENT_ID}&client_secret=${FOURSQUARE_CLIENT_SECRET}&v=${FOURSQUARE_VERSION}`;
}

module.exports = providerName => {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    const { query, latitude, longitude } = req.query;

    const params = {
      client_id: FOURSQUARE_CLIENT_ID,
      client_secret: FOURSQUARE_CLIENT_SECRET,
      v: FOURSQUARE_VERSION,
      limit: FOURSQUARE_LIMIT,
      query,
      ll: `${latitude},${longitude}`
    };

    try {
      const { response } = await request({
        uri: FOURSQUARE_API_ENDPOINT,
        qs: params,
        json: true
      });

      const venues = response.venues.map(v => ({
        id: v.id,
        provider: providerName,
        name: v.name,
        description: buildDescription(v.categories),
        location: {
          latitude: v.location.lat,
          longitude: v.location.lng
        },
        address: v.location.formattedAddress.join(", "),
        uri: buildURI(v)
      }));

      res.json({
        payload: venues,
        total: 0,
        error: false
      });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
