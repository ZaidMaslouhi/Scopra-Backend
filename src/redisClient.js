const { client, subscriber } = require("./config/redis");
const { wss } = require("./config/webSocket");

// client.on("error", (err) => console.error("Redis Client Error", err));
// client.on("connect", () => console.log("Redis Client Connected"));
// subscriber.on("connect", () => console.log(`Subscribed connected.`));

const userMonitors = [];

wss.on("connection", async function connection(ws) {
  console.log(`WS connected.`);

  ws.on("message", async (message) => {
    const monitorsList = JSON.parse(message);
    userMonitors.push({ connection: ws, monitors: monitorsList });
  });

  subscriber.subscribe("monitors", (message, channel) => {
    // console.log(`Subscribed to ${channel} channel.`);
    const obj = JSON.parse(message);
    userMonitors.forEach((arr) => {
      const monitor = arr.monitors.find((task) => task === obj.task);
      if (monitor) {
        // console.log(`Send it via WS!`);
        arr.connection.send(message);
      }
    });
  });
});

exports.default = client;

// Using websockets allows for a more efficient and scalable approach,
// as it allows for bi-directional communication between the server and client.
// With websockets, the server can push data to the client in real-time as soon as new data is available.
// This means that the client does not have to repeatedly poll the server for new data,
// reducing the amount of network traffic and server load.

// On the other hand, subscribing directly from the frontend and updating the dashboard can also work,
// but it requires the client to constantly poll the server for new data.
// This approach can be less efficient and put more strain on the server,
// especially if there are a large number of clients constantly requesting updates.

// Ultimately, the choice of which approach to use depends on the specific needs of your app.
// If you need real-time updates and low latency, websockets may be the best choice.
// If real-time updates are not critical and network bandwidth is a concern,
// subscribing from the frontend may be a better option.
