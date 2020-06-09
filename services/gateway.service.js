"use strict";

const express = require("express");
const bodyParser = require("body-parser");

module.exports = {
  name: "gateway",
  settings: {
    port: process.env.PORT || 3000
  },
  methods: {
    initRoutes(app) {
      app.get("/co/:id", this.getCO);
      app.get("/so2/:id", this.getSO2);
      app.get("/no2/:id", this.getNO2);
      //app.put("/set", this.putData);
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
    app.listen(this.settings.port);
    this.initRoutes(app);
    this.app = app;
  }
};
