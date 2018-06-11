const swaggerJSDoc = require("swagger-jsdoc");
const PORT = process.env.PORT || 3000;

// Swagger definition
const swaggerDefinition = {
  info: {
    description:
      "REST API which expose places information consumed from different providers such as Google Places, FourSquare, Yelp, etc.",
    version: "1.0.0",
    title: "Places API",
    contact: {
      contact: "maxmedina05@gmail.com"
    }
  },
  host: "localhost:" + PORT,
  basePath: "/api/v1",
  definitions: {
    Place: {
      properties: {
        id: { type: "string" },
        provider: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        location: {
          type: "object",
          properties: {
            latitude: { type: "number" },
            longitude: { type: "number" }
          }
        },
        address: { type: "string" },
        uri: { type: "string" }
      }
    },
    Response: {
      type: "array",
      items: { $ref: "#definitions/Place" }
    }
  }
};
const options = {
  swaggerDefinition: swaggerDefinition,
  apis: ["./src/*.router.js"]
};

module.exports = swaggerJSDoc(options);
