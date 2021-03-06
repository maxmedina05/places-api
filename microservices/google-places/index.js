require("dotenv").config({ path: __dirname + "/.env" });
const PORT = process.env.PORT || 3100;
const PROVIDER_NAME = "Google Places";

const app = require("express")();

const websocketClient = require("./src/websocket-client")({
  name: PROVIDER_NAME,
  url: `http://localhost:${PORT}/places`
});

app.use("/places", require("./src/google-places.router")(PROVIDER_NAME));

app.get("*", (req, res) => {
  res.status(404).send("Nothing here!");
});

app.use(
  require("./src/error-handler.middleware")(websocketClient.sendErrorMessage)
);

app.listen(PORT, () => {
  console.log(PROVIDER_NAME, "listening on port: ", PORT);
});
