require("dotenv").config();
const PORT = process.env.PORT || 3100;
const PROVIDER_NAME = "Google Places";

const app = require("express")();

const websocketClient = require("./src/websocket-client")({
  name: PROVIDER_NAME,
  url: `http://localhost:${PORT}/places`
});

app.use("/places", require("./src/google-places.router"));

app.use((err, req, res, next) => {
  const error = {
    name: err.name,
    message: err.message
  };

  websocketClient.sendErrorMessage(error);

  res.json({
    payload: [],
    error: error
  });
  next();
});

app.listen(PORT, () => {
  console.log(PROVIDER_NAME, "listening on port: ", PORT);
});