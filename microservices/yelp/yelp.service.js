require("dotenv").config();
const yelp = require("yelp-fusion");
const PORT = process.env.PORT || 3200;
const SOCKET_SERVER = process.env.SOCKET_SERVER || "http://localhost:3000";
const BASE_API_URL = "/api/v1";
const PROVIDER_NAME = "Yelp";
const YELP_FUSION_API_ENDPOINT = "https://api.yelp.com/v3";
const YELP_API_KEY = process.env.YELP_API_KEY;
const app = require("express")();
const socket = require("socket.io-client")(SOCKET_SERVER);

const yelpClient = yelp.client(YELP_API_KEY);

socket.on("connect", () => {
  socket.emit("subscribe", {
    name: PROVIDER_NAME,
    url: `http://localhost:${PORT}${BASE_API_URL}/places`
  });
});

app.get(BASE_API_URL + "/places", async (req, res) => {
  const { query, latitude, longitude } = req.query;

  const searchRequest = {
    term: query,
    latitude,
    longitude
  };

  const response = (await yelpClient.search(searchRequest)).jsonBody;
  const places = response.businesses.map(b => ({
    id: b.id,
    provider: PROVIDER_NAME,
    name: b.name,
    description: "",
    location: {
      latitude: b.coordinates.latitude,
      longitude: b.coordinates.longitude
    },
    address: makeFormattedAddress(b.location),
    uri: b.url
  }));
  res.json(places);
});

function makeFormattedAddress(location) {
  return `${location.address1}, ${location.city}, ${location.state}`;
}

app.listen(PORT, () => {
  console.log(PROVIDER_NAME, " running on port: ", PORT);
});
