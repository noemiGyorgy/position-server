const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const io = require("socket.io-client");
const dbController = require("./controllers/db-controller.js");
require("dotenv").config();

const port = process.env.PORT;
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
const server = http.createServer(app);
let stopped = true;

dbController.initialize();

const clientSocket = io.connect("http://localhost:5000", {
  withCredentials: true,
});

clientSocket.on("connection", (message) => {
  console.log("Server: " + message);
});

clientSocket.on("position", (position) => {
  if (!stopped) {
    dbController.savePosition(position);
  }
});

clientSocket.on("endOfTrack", (message) => {
  dbController.terminateLiveStreaming();
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
