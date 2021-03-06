"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const cors = require("cors");
const nats = require("nats");

module.exports = {
  name: "gateway",
  settings: {
    port: process.env.PORT || 3000
  },
  methods: {
    initRoutes(app) {
      app.get("/stats", this.getStats);
      app.get("/co/:id", this.getCO);
      app.get("/so2/:id", this.getSO2);
      app.get("/no2/:id", this.getNO2);
      app.get("/co/new/:id", this.getCOSp);
      app.get("/so2/new/:id", this.getSO2Sp);
      app.get("/no2/new/:id", this.getNO2Sp);
      app.put("/co/cleaner", this.CleanerCO);
      app.put("/so2/cleaner", this.CleanerSO2);
      app.put("/no2/cleaner", this.CleanerNO2);
      app.put("/co/cleaner/lvl", this.CleanerCOLvl);
      app.put("/so2/cleaner/lvl", this.CleanerSO2Lvl);
      app.put("/no2/cleaner/lvl", this.CleanerNO2Lvl);
      app.put("/cleaner/all", this.CleanerAll);
      app.get("/max_value/all", this.MaxValue);
      app.put("/device/interval", this.changeInterval);
    },
    changeInterval(req, res) {
      console.log("Change interval: " + req.body);
      this.broker.emit("device.changeInterval", req.body);
      res.send("changed");
    },
    getStats(req, res) {
      return Promise.resolve()
        .then(() => {
          return this.broker.call("device.getStats").then(result => {
            console.log(result);
            res.send(result);
          });
        })
        .catch(this.handleErr(res));
    },
    getCO(req, res) {
      const sensorId = req.params.id ? Number(req.params.id) : 0;
      if (sensorId == 0) {
        res.send({ error: "Id not specified" });
      }
      return Promise.resolve()
        .then(() => {
          return this.broker
            .call("data.readCO", { sensorId: sensorId })
            .then(result => {
              res.send(result);
            });
        })
        .catch(this.handleErr(res));
    },
    getSO2(req, res) {
      const sensorId = req.params.id ? Number(req.params.id) : 0;
      if (sensorId == 0) {
        res.send({ error: "Id not specified" });
      }
      return Promise.resolve()
        .then(() => {
          return this.broker
            .call("data.readSO2", { sensorId: sensorId })
            .then(result => {
              res.send(result);
            });
        })
        .catch(this.handleErr(res));
    },
    getNO2(req, res) {
      const sensorId = req.params.id ? Number(req.params.id) : 0;
      if (sensorId == 0) {
        res.send({ error: "Id not specified" });
      }
      return Promise.resolve()
        .then(() => {
          return this.broker
            .call("data.readNO2", { sensorId: sensorId })
            .then(result => {
              res.send(result);
            });
        })
        .catch(this.handleErr(res));
    },
    getCOSp(req, res) {
      const sensorId = req.params.id ? Number(req.params.id) : 0;
      if (sensorId == 0) {
        res.send({ error: "Id not specified" });
      }
      return Promise.resolve()
        .then(() => {
          return this.broker
            .call("data.readCOSp", { sensorId: sensorId })
            .then(result => {
              res.send(result);
            });
        })
        .catch(this.handleErr(res));
    },
    getSO2Sp(req, res) {
      const sensorId = req.params.id ? Number(req.params.id) : 0;
      if (sensorId == 0) {
        res.send({ error: "Id not specified" });
      }
      return Promise.resolve()
        .then(() => {
          return this.broker
            .call("data.readSO2Sp", { sensorId: sensorId })
            .then(result => {
              res.send(result);
            });
        })
        .catch(this.handleErr(res));
    },
    getNO2Sp(req, res) {
      const sensorId = req.params.id ? Number(req.params.id) : 0;
      if (sensorId == 0) {
        res.send({ error: "Id not specified" });
      }
      return Promise.resolve()
        .then(() => {
          return this.broker
            .call("data.readNO2Sp", { sensorId: sensorId })
            .then(result => {
              res.send(result);
            });
        })
        .catch(this.handleErr(res));
    },
    CleanerCO(req, res) {
      let data = req.body;
      if (data.Switch) this.broker.emit("device.turnCOCleanerOn");
      else this.broker.emit("device.turnCOCleanerOff");
      res.send({ message: "successfull" });
    },
    CleanerSO2(req, res) {
      let data = req.body;
      if (data.Switch) this.broker.emit("device.turnSO2CleanerOn");
      else this.broker.emit("device.turnSO2CleanerOff");
      res.send({ message: "successfull" });
    },
    CleanerNO2(req, res) {
      let data = req.body;
      if (data.Switch) this.broker.emit("device.turnNO2CleanerOn");
      else this.broker.emit("device.turnNO2CleanerOff");
      res.send({ message: "successfull" });
    },
    CleanerCOLvl(req, res) {
      let data = req.body;
      this.broker.emit("device.changeCOCleanerLvl", data);
      res.send({ message: "successfull" });
    },
    CleanerSO2Lvl(req, res) {
      let data = req.body;
      this.broker.emit("device.changeSO2CleanerLvl", data);
      res.send({ message: "successfull" });
    },
    CleanerNO2Lvl(req, res) {
      let data = req.body;
      this.broker.emit("device.changeNO2CleanerLvl", data);
      res.send({ message: "successfull" });
    },
    CleanerAll(req, res) {
      let data = req.body;
      this.broker.emit("device.turnCOCleanerOn");
      this.broker.emit("device.turnSO2CleanerOn");
      this.broker.emit("device.turnNO2CleanerOn");
      this.broker.emit("device.changeNO2CleanerLvl", data);
      this.broker.emit("device.changeSO2CleanerLvl", data);
      this.broker.emit("device.changeCOCleanerLvl", data);
      res.send({ message: "successfull" });
    },
    MaxValue(req, res) {
      request.get(process.env.ANALYTICS_URL, (err, res1, body) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(body);
        res.send(body);
      });
    },

    handleErr(res) {
      return err => {
        res.status(err.code || 500).send(err.message);
      };
    }
  },
  created() {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors());
    app.listen(this.settings.port);
    this.initRoutes(app);
    this.app = app;
  }
};
