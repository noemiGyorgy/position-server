const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const clientIo = require("socket.io-client");
const dbController = require("./controllers/db-controller.js");
require("dotenv").config();

const port = process.env.PORT;
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: [process.env.FRONTEND, process.env.FRONTEND + "/tracks"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);
const server = http.createServer(app);
const serverIo = require("socket.io")(server, {
  cors: {
    origin: process.env.FRONTEND,
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});
let stopped = false;

dbController.initialize();

const clientSocket = clientIo.connect(process.env.STREAMER, {
  withCredentials: true,
});

clientSocket.on("connection", (message) => {
  console.log("Server: " + message);
});

clientSocket.on("position", (position) => {
  if (!stopped) {
    dbController.savePosition(position);
  }
  serverIo.emit("position", { ...position, stopped: stopped });
});

clientSocket.on("endOfTrack", (message) => {
  dbController
    .terminateLiveStreaming()
    .then(() => dbController.getTracks())
    .then((rows) => serverIo.emit("endOfTrack", rows));
});

serverIo.on("connection", (socket) => {
  dbController.getTracks().then((rows) => serverIo.emit("connection", rows));
});

app.put("/status", (req, res) => {
  stopped = !stopped;
  res.send({ stopped: stopped });
});

app.get("/tracks", (req, res) => {});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
