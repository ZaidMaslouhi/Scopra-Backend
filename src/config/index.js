const Env = require("./envirement");
const RedisServer = require("./redis");
const WebSocketServer = require("./webSocket");
const Axios = require("./axios");

module.exports = {
  ...Env,
  Redis: RedisServer,
  WSS: WebSocketServer,
  Axios: Axios,
};
