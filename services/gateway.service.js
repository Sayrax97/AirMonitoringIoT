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
      app.get("/soilTemperature/:id", this.getSoilTemperature);
      app.get("/airTemperature", this.getAirTemperature);
      app.get("/RHpercent", this.getRHpercent);
      app.get("/waterContent", this.getWaterContent);
      //app.put("/set", this.putData);
    },
    getSoilTemperature(req, res) {
      const sensorId = req.params.id ? Number(req.paramsquery.id) : 0;
      return Promise.resolve()
        .then(() => {
          return this.broker
            .call("data.readSoilTemperature", { sensorId: sensorId })
            .then(result => {
              res.send(result);
            });
        })
        .catch(this.handleErr(res));
    },
    getAirTemperature(req, res) {
      const sensorId = req.query.id ? Number(req.query.id) : 0;
      return Promise.resolve()
        .then(() => {
          return this.broker
            .call("data.readAirTemperature", { sensorId: sensorId })
            .then(result => {
              res.send(result);
            });
        })
        .catch(this.handleErr(res));
    },
    getRHpercent(req, res) {
      const sensorId = req.query.id ? Number(req.query.id) : 0;
      return Promise.resolve()
        .then(() => {
          return this.broker
            .call("data.readRHPercent", { sensorId: sensorId })
            .then(result => {
              res.send(result);
            });
        })
        .catch(this.handleErr(res));
    },
    getWaterContent(req, res) {
      const sensorId = req.query.id ? Number(req.query.id) : 0;
      return Promise.resolve()
        .then(() => {
          return this.broker
            .call("data.readWaterContent", { sensorId: sensorId })
            .then(result => {
              res.send(result);
            });
        })
        .catch(this.handleErr(res));
    },
    // putData(req, res) {
    //     const body = req.body;
    //     console.log(body);
    //     return Promise.resolve()
    //     .then(() => {
    //         return this.broker.call('actuator.set', body).then(r =>
    //             res.send(r)
    //         );
    //     })
    //     .catch(this.handleErr(res));
    // },
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
