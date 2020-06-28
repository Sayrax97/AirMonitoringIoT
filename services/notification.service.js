const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const socketio = require("socket.io");

module.exports = {
  name: "notification",
  settings: {
    port: 3002
  },
  actions: {
    newData() {
      this.io.emit("new.data", "new data added");
    }
  },
  created() {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    const server = require("http").createServer(app);
    const io = socketio(server);
    io.set("origins", "*:*");
    io.on("connection", socket => {
      console.log("new connection");
    });
    app.post("/publish/so2", (req, res) => {
      io.emit("warning.so2", req.body);
      res.send("ok");
    });
    app.post("/publish/co", (req, res) => {
      io.emit("warning.co", req.body);
      res.send("ok");
    });
    app.post("/publish/no2", (req, res) => {
      io.emit("warning.no2", req.body);
      res.send("ok");
    });
    app.post("/publish/aqilow", (req, res) => {
      io.emit("warning.aqi.low", req.body);
      res.send("ok");
    });
    app.post("/publish/aqi", (req, res) => {
      io.emit("warning.aqi", req.body);
      res.send("ok");
    });
    app.post("/actuator", (req, res) => {
      io.emit("actuator", req.body);
      res.send("ok");
    });
    app.listen(3001, () => {
      console.log("REST server started");
    });
    server.listen(this.settings.port, () => {
      console.log(`server running on port ${this.settings.port}`);
    });
    this.io = io;
  }
};
