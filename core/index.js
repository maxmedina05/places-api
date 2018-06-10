require("dotenv").config();
const PORT = process.env.PORT || 3000;
const BASE_API_URL = "/api/v1";

const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const axios = require("axios");

var providers = [];

io.on("connection", socket => {
  socket.on("subscribe", data => {
    const newProvider = {
      id: socket.id,
      name: data.name,
      url: data.url
    };

    providers = [...providers, newProvider];
    console.log(`Provider ${newProvider.name} has subscribed!`);
  });

  socket.on("disconnect", () => {
    const provider = providers.find(p => p.id === socket.id);
    console.log(`Provider ${provider.name} has unsubscribed!`);
    providers = providers.filter(p => p.id !== socket.id);
  });
});

app.get(BASE_API_URL + "/places", async (req, res) => {
  const { query, latitude, longitude } = req.query;
  let allPlaces = [];

  for (const provider of providers) {
    try {
      const places = (await axios.get(
        `${
          provider.url
        }?query=${query}&latitude=${latitude}&longitude=${longitude}`
      )).data;

      allPlaces = allPlaces.concat(allPlaces, places);
    } catch (e) {}
  }

  res.json(allPlaces);
});

server.listen(PORT);
