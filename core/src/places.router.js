const express = require("express");
const axios = require("axios");
const providerManager = require("./provider-manager");

const router = express.Router();

router.get("/", async (req, res) => {
  const { query, latitude, longitude } = req.query;
  let places = [];

  for (const provider of providerManager.getProviders()) {
    const response = (await axios.get(
      `${
        provider.url
      }?query=${query}&latitude=${latitude}&longitude=${longitude}`
    )).data;

    places = places.concat(places, response);
  }

  res.json(places);
});

module.exports = router;
