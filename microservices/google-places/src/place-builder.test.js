const { buildPlace } = require("./place-builder");
const GOOGLE_PLACES_RESPONSE = require("./google-places-results.mock.json");

describe("Place Builder", () => {
  it("should build a place with the following properties: ID, Provider, Name, Description, Location, Address, Uri from a Google Place Result.", () => {
    const result = GOOGLE_PLACES_RESPONSE.results[0];
    const providerName = "Dummy Provider";

    const place = buildPlace(result, providerName, "");
    expect(place).toHaveProperty("id", result.place_id);
    expect(place).toHaveProperty("provider", providerName);
    expect(place).toHaveProperty("name", result.name);
    expect(place).toHaveProperty("description");
    expect(place).toHaveProperty("location");
    expect(place).toHaveProperty("address");
    expect(place).toHaveProperty("uri");
  });
});
