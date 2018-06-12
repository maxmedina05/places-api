require("dotenv").config({ path: __dirname + "/.env" });
const PORT = process.env.PORT || 3200;
const SOCKET_SERVER = process.env.SOCKET_SERVER || "http://localhost:3000";
const PROVIDER_NAME = "Yelp";

const SUBSCRIBE_EVENT = "subscribe";
const ERROR_EVENT = "provider-error";

const app = require("express")();
const socket = require("socket.io-client")(SOCKET_SERVER);

socket.on("connect", () => {
  socket.emit(SUBSCRIBE_EVENT, {
    name: PROVIDER_NAME,
    url: `http://localhost:${PORT}/businesses`
  });
});

app.use("/businesses", require("./yelp.router")(PROVIDER_NAME));

app.get("*", (req, res) => {
  res.status(404).send("Nothing here!");
});

app.use((err, req, res, next) => {
  console.log(err);
  const error = {
    name: err.name,
    message: err.message
  };
  socket.emit(ERROR_EVENT, error);

  res.json({
    payload: [],
    error: error
  });
  next();
});

app.listen(PORT, () => {
  console.log(PROVIDER_NAME, "listening on port: ", PORT);
});
