"use strict";

const fs = require("fs");

module.exports = {
  name: "device",
  methods: {
    init() {
      setInterval(() => {
        let recordCO = this.dataCO[this.IndexCO];
        this.IndexCO = (this.IndexCO + 1) % this.dataCO.length;

        let recordSO2 = this.dataSO2[this.IndexSO2];
        this.IndexSO2 = (this.IndexSO2 + 1) % this.dataSO2.length;

        let recordNO2 = this.dataNO2[this.IndexNO2];
        this.IndexNO2 = (this.IndexNO2 + 1) % this.dataNO2.length;

        this.broker.emit("device.parametersRead", {
          sensorId: this.sensorId,
          CO_Con: recordCO.CO_Con,
          CO_AQI: recordCO.AQI_VALUE,
          CO_AQS_Name: recordCO.AQS_PARAMETER_DESC,
          NO2_Con: recordNO2.NO2_Con,
          NO2_AQI: recordNO2.AQI_VALUE,
          NO2_AQS_Name: recordNO2.AQS_PARAMETER_DESC,
          SO2_Con: recordSO2.SO2_Con,
          SO2_AQI: recordSO2.AQI_VALUE,
          SO2_AQS_Name: recordSO2.AQS_PARAMETER_DESC,
          Time: Date.now()
        });
      }, this.interval);
    },
    readData() {
      fs.readFile("data/co.json", (error, data) => {
        if (error) throw error;
        this.dataCO = JSON.parse(data);
        console.log(this.dataCO.length);
      });
      fs.readFile("data/no2.json", (error, data) => {
        if (error) throw error;
        this.dataNO2 = JSON.parse(data);
        console.log(this.dataNO2.length);
      });
      fs.readFile("data/so2.json", (error, data) => {
        if (error) throw error;
        this.dataSO2 = JSON.parse(data);
        console.log(this.dataSO2.length);
      });
    }
  },
  events: {
    "device.turnAirCleanerOn": {
      group: "other",
      handler(payload) {
        console.log('Received "turnAirCleanerOn" event: Air cleaner turned ON');
        this.airCleaner = true;
      }
    },
    "device.turnAirCleanerOff": {
      group: "other",
      handler(payload) {
        console.log(
          'Received "turnAirCleanerOff" event: Air cleaner turned OFF'
        );
        this.airCleaner = false;
      }
    },
    "device.increaseFactoryPL": {
      group: "other",
      handler(payload) {
        console.log(
          `Received "increaseFactoryPL" event with payload: ${payload}`
        );
        if (factoryProductionLvl + payload.value <= 100)
          this.factoryProductionLvl += payload.value;
        else {
          console.log(
            `Factory production level cannot exceed 100%, current: ${this.factoryProductionLvl}`
          );
        }
      }
    },
    "device.decreaseFactoryPL": {
      group: "other",
      handler(payload) {
        console.log(
          `Received "decreaseFactoryPL" event with payload: ${payload}`
        );
        if (factoryProductionLvl - payload.value < 0)
          this.factoryProductionLvl -= payload.value;
        else {
          console.log(
            `Factory production level cannot go below 0%, current: ${this.factoryProductionLvl}`
          );
        }
      }
    },
    "device.increaseTrafficLimit": {
      group: "other",
      handler(payload) {
        console.log(
          `Received "increaseTrafficLimit" event with payload: ${payload}`
        );
        this.trafficLimit += payload.value;
      }
    },
    "device.decreaseTrafficLimit": {
      group: "other",
      handler(payload) {
        console.log(
          `Received "decreaseTrafficLimit" event with payload: ${payload}`
        );
        this.trafficLimit -= payload.value;
      }
    }
  },
  created() {
    // actuator
    this.airCleaner = false; //air cleaner on/off
    this.factoryProductionLvl = 75; //Procent of active factories production
    this.trafficLimit = 100000; //Vehicles on street
    this.ECOtax = 1.25; //$ per ppm(parts per million)
    this.AQI_max = 50; //max value of Air Quality Index
    // sensor
    this.sensorId = 1;
    this.IndexCO = 0;
    this.IndexSO2 = 0;
    this.IndexNO2 = 0;
    this.interval = 10000;
    // init
    this.readData();
    this.init();
  }
};
