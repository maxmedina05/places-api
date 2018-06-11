const buildWebSocketClient = require("socket.io-client");
const WEBSOCKET_SERVER_ENDPOINT =
  process.env.WEBSOCKET_SERVER_ENDPOINT || "http://localhost:3000";

const SUBSCRIBE_EVENT = "subscribe";
const ERROR_EVENT = "provider-error";

function sendErrorMessage(client, error) {
  console.log("sendErrorMessage");
  client.emit(ERROR_EVENT, error);
}

module.exports = function({ name, url }) {
  const client = buildWebSocketClient(WEBSOCKET_SERVER_ENDPOINT);

  client.on("connect", () => {
    client.emit(SUBSCRIBE_EVENT, {
      name,
      url
    });
  });

  return {
    sendErrorMessage: error => sendErrorMessage(client, error)
  };
};
