const dotenv = require("dotenv");

// if (process.env.NODE_ENV !== "prod") {
//   const configFile = `./.env.${process.env.NODE_ENV}`;
//   dotenv.config({ path: configFile });
// } else {
dotenv.config();
// }

module.exports = {
  // App variables
  APP_SECRET: process.env.APP_SECRET,
  PORT: process.env.PORT || 3000,
  // JWT
  REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY,
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY,
  // DataBase
  DB_URI: process.env.DB_URI,
  // Redis
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  // WebSocket
  WS_HOST: process.env.WS_HOST || "localhost",
  WS_PORT: process.env.WS_PORT || 4000,
  MONITORS_CHANNEL: process.env.MONITORS_CHANNEL,
};
