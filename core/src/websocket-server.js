const buildWebSocketServer = require("socket.io");
const providerManager = require("./provider-manager");

const SUBSCRIBE_EVENT = "subscribe";
const UNSUBSCRIBE_EVENT = "disconnect";

function handleSubscribe(client, data) {
  const newProvider = {
    id: client.id,
    name: data.name,
    url: data.url
  };
  const providers = providerManager.getProviders();
  providerManager.setProviders([...providers, newProvider]);

  console.log(`${newProvider.name} has subscribed.`);
}

function handleUnsubscribe(client) {
  const providers = providerManager.getProviders();
  const provider = providers.find(p => p.id === client.id);
  providerManager.setProviders(providers.filter(p => p.id !== client.id));

  console.log(`${provider.name} unsubscribed.`);
}

module.exports = function(server) {
  const io = buildWebSocketServer(server);

  io.on("connection", client => {
    client.on(SUBSCRIBE_EVENT, data => handleSubscribe(client, data));
    client.on(UNSUBSCRIBE_EVENT, () => handleUnsubscribe(client));
  });
};
