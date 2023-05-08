const Env = require("./envirement");
const RedisServer = require("./redis");
const WebSocketServer = require("./webSocket");
const Axios = require("./axios");
const PassportConfig = require("./Oauth");

module.exports = {
  ...Env,
  Redis: RedisServer,
  WSS: WebSocketServer,
  Axios: Axios,
  PassportConfig: PassportConfig,
};
