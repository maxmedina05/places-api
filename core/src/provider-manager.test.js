describe("Providers Singleton", () => {
  it("Should only be one instance of the providers collection", () => {
    const instance1 = require("./provider-manager");
    const instance2 = require("./provider-manager");

    const providers = [
      {
        name: "Dummy 1",
        url: "http://localhost:3000/places"
      },
      {
        name: "Google Places",
        url: "http://localhost:3100/places"
      }
    ];
    instance1.setProviders(providers);
    expect(instance1.getProviders()).toMatchObject(providers);
    expect(instance2.getProviders()).toMatchObject(providers);
  });

  it("Should return a copy of the providers collection", () => {
    const instance = require("./provider-manager");
    const providers = [
      {
        name: "Dummy 1",
        url: "http://localhost:3000/places"
      },
      {
        name: "Google Places",
        url: "http://localhost:3100/places"
      }
    ];
    instance.setProviders(providers);

    expect(instance.getProviders()).toEqual(providers);
    expect(providers !== instance.getProviders()).toBeTruthy();
  });
});
