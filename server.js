const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const io = require("socket.io-client");
const db = require("./database/queries");

const port = 4000 || process.env.PORT;
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
const server = http.createServer(app);

const clientSocket = io.connect("http://localhost:5000", {
  withCredentials: true,
});

clientSocket.on("connection", (message) => {
  console.log("Server: " + message);
});

clientSocket.on("position", (position) => {
  console.log("Position: " + position);
  db.savePosition(position);
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
