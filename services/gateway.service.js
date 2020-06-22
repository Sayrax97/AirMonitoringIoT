"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { response } = require("express");

module.exports = {
  name: "gateway",
  settings: {
    port: process.env.PORT || 3000,
  },
  methods: {
    initRoutes(app) {
      app.get("/stats", this.getStats);
      app.get("/co/:id", this.getCO);
      app.get("/so2/:id", this.getSO2);
      app.get("/no2/:id", this.getNO2);
      app.post("/co/:id/query", this.Query);
      app.put("/co/cleaner", this.CleanerCO);
      app.put("/so2/cleaner", this.CleanerSO2);
      app.put("/no2/cleaner", this.CleanerNO2);
      app.put("/co/cleaner/lvl", this.CleanerCOLvl);
      app.put("/so2/cleaner/lvl", this.CleanerSO2Lvl);
      app.put("/no2/cleaner/lvl", this.CleanerNO2Lvl);
      app.put("/cleaner/all", this.CleanerAll);
      app.get("/max_value/all", this.MaxValue);
    },
    Query(req, res) {
      return Promise.resolve()
        .then(() => {
          return this.broker.call("data.query").then((result) => {
            console.log(result);
            res.send(result);
          });
        })
        .catch(this.handleErr(res));
    },
    getStats(req, res) {
      return Promise.resolve()
        .then(() => {
          return this.broker.call("device.getStats").then((result) => {
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
            .then((result) => {
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
            .then((result) => {
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
            .then((result) => {
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
    MaxValue() {
      request.get(process.env.ANALYTICS_URL, (err, res, body) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(body);
        response.send(body);
      });
    },

    handleErr(res) {
      return (err) => {
        res.status(err.code || 500).send(err.message);
      };
    },
  },
  created() {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.listen(this.settings.port);
    this.initRoutes(app);
    this.app = app;
  },
};
