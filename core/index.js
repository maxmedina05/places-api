require("dotenv").config();
const PORT = process.env.PORT || 3000;
const BASE_API_URL = "/api/v1";

const app = require("express")();
const server = require("http").Server(app);
const websocketHandler = require("./src/websocket-server")(server);

const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger.config");

app.use(`${BASE_API_URL}/places`, require("./src/places.router"));
app.use(`${BASE_API_URL}/docs`, swaggerUI.serve, swaggerUI.setup(swaggerSpec));

server.listen(PORT, () => {
  console.log("Core service listening on port:", PORT);
});
