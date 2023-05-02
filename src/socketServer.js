const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ port: 8888 });

exports.default = wss;
