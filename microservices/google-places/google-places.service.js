require("dotenv").config();
const axios = require("axios");

const PORT = process.env.PORT || 3100;
const SOCKET_SERVER = process.env.SOCKET_SERVER || "http://localhost:3000";
const BASE_API_URL = "/api/v1";
const PROVIDER_NAME = "Google Places";

const app = require("express")();
const socket = require("socket.io-client")(SOCKET_SERVER);

socket.on("connect", () => {
  socket.emit("subscribe", {
    name: PROVIDER_NAME,
    url: `http://localhost:${PORT}${BASE_API_URL}/places`
  });
});

app.get(BASE_API_URL + "/places", async (req, res) => {
  const { query, latitude, longitude } = req.query;
  try {
    const response = (await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${
        process.env.GOOGLE_PLACES_API_KEY
      }&location=${latitude},${longitude}`
    )).data;

    const { results } = response;

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
  } catch (e) {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(PROVIDER_NAME, " running on port: ", PORT);
});
