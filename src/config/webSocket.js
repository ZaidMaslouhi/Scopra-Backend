const { WebSocketServer } = require("ws");
const { WS_HOST, WS_PORT } = require("./envirement");

const wss = new WebSocketServer({
  host: WS_HOST,
  port: WS_PORT,
});

module.exports = wss;
