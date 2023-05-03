const { createClient } = require("redis");
const { REDIS_HOST, REDIS_PORT } = require("./envirement");

const client = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});
client.connect((error) => {
  if (error) console.error(error);
  console.log("Client Connected to Redis");
});

const subscriber = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});
subscriber.connect((error) => {
  if (error) console.error(error);
  console.log("Subscriber Connected to Redis");
});

const publisher = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});
publisher.connect((error) => {
  if (error) console.error(error);
  console.log("Publisher Connected to Redis");
});

module.exports = {
  client,
  subscriber,
  publisher,
};
