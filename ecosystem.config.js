module.exports = {
  apps: [
    {
      name: "Core Service",
      script: "./core/index.js"
    },
    {
      name: "Google Places API",
      script: "./microservices/google-places/index.js"
    },
    {
      name: "Yelp API",
      script: "./microservices/yelp/index.js"
    },
    {
      name: "Foursquare API",
      script: "./microservices/foursquare/index.js"
    }
  ]
};
