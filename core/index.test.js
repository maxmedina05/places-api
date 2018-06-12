const app = require("./index");
const request = require("supertest");
const ENDPOINT = "/api/v1/places";

describe("Core Service", () => {
  it("should return NO_PROVIDER_AVAILABLE error when there are no providers", done => {
    request(app)
      .get(ENDPOINT)
      .end((err, res) => {
        try {
          const { payload, error } = res.body;
          expect(err).toBeNull();
          expect(res.status).toBe(500);
          expect(res.type).toBe("application/json");
          expect(payload).toBeDefined;
          expect(error).toBeDefined;

          expect(error.name).toBe("NO_PROVIDER_AVAILABLE");
          expect(payload.length).toBe(0);
          done();
        } catch (e) {
          done.fail(e);
        }
      });
  });
});
