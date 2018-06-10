const express = require("express");
const router = express.Router();
const axios = require("axios");
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_ENDPOINT =
  "https://maps.googleapis.com/maps/api/place/textsearch";

router.get("/", async (req, res) => {
  const { query, latitude, longitude } = req.query;
  const endpoint = `${GOOGLE_PLACES_ENDPOINT}/json?query=${query}&key=${GOOGLE_PLACES_API_KEY}&location=${latitude},${longitude}`;

  const { results } = (await axios.get(endpoint)).data;

  const places = results.map(r => ({
    id: r.place_id,
    provider: "Google Places",
    name: r.name,
    description: "",
    location: {
      latitude: r.geometry.location.lat,
      longitude: r.geometry.location.lng
    },
    address: r.formatted_address,
    uri: ""
  }));

  res.json(places);
});

module.exports = router;
