"use strict";

const fs = require("fs");

module.exports = {
  name: "device",
  actions: {
    getStats() {
      console.log({
        sendorID: this.sensorId,
        interval: this.interval,
        CleanerCO: this.CleanerCO,
        CleanerSO2: this.CleanerSO2,
        CleanerNO2: this.CleanerNO2,
        CleanerCOLvl: this.CleanerCOLvl,
        CleanerSO2Lvl: this.CleanerSO2Lvl,
        CleanerNO2Lvl: this.CleanerNO2Lvl
      });

      return {
        sendorID: this.sensorId,
        interval: this.interval,
        CleanerCO: this.CleanerCO,
        CleanerSO2: this.CleanerSO2,
        CleanerNO2: this.CleanerNO2,
        CleanerCOLvl: this.CleanerCOLvl,
        CleanerSO2Lvl: this.CleanerSO2Lvl,
        CleanerNO2Lvl: this.CleanerNO2Lvl
      };
    }
  },
  methods: {
    init() {
      this.intervalID = setInterval(() => {
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
      });
      fs.readFile("data/no2.json", (error, data) => {
        if (error) throw error;
        this.dataNO2 = JSON.parse(data);
      });
      fs.readFile("data/so2.json", (error, data) => {
        if (error) throw error;
        this.dataSO2 = JSON.parse(data);
      });
    }
  },
  events: {
    "device.changeInterval": {
      group: "other",
      handler(payload) {
        console.log(
          'Received "changeInterval" event: with payload' +
            JSON.stringify(payload)
        );
        this.interval = payload.interval;
        clearInterval(this.intervalID);
        this.init();
      }
    },
    "device.turnCOCleanerOn": {
      group: "other",
      handler(payload) {
        console.log('Received "turnCOCleanerOn" event: CO cleaner turned ON');
        this.CleanerCO = true;
      }
    },
    "device.turnCOCleanerOff": {
      group: "other",
      handler(payload) {
        console.log('Received "turnCOCleanerOff" event: CO cleaner turned OFF');
        this.CleanerCO = false;
      }
    },
    "device.turnSO2CleanerOn": {
      group: "other",
      handler(payload) {
        console.log('Received "turnSO2CleanerOn" event: SO2 cleaner turned ON');
        this.CleanerSO2 = true;
      }
    },
    "device.turnSO2CleanerOff": {
      group: "other",
      handler(payload) {
        console.log(
          'Received "turnSO2CleanerOff" event: SO2 cleaner turned OFF'
        );
        this.CleanerSO2 = false;
      }
    },
    "device.turnNO2CleanerOn": {
      group: "other",
      handler(payload) {
        console.log('Received "turnNO2CleanerOn" event: NO2 cleaner turned ON');
        this.CleanerNO2 = true;
      }
    },
    "device.turnNO2CleanerOff": {
      group: "other",
      handler(payload) {
        console.log(
          'Received "turnNO2CleanerOff" event: NO2 cleaner turned OFF'
        );
        this.CleanerNO2 = false;
      }
    },
    "device.changeCOCleanerLvl": {
      group: "other",
      handler(payload) {
        console.log(
          `Received "changeCOCleanerLvl" event with payload: ${JSON.stringify(
            payload
          )}`
        );
        this.CleanerCOLvl = payload.Lvl;
      }
    },
    "device.changeSO2CleanerLvl": {
      group: "other",
      handler(payload) {
        console.log(
          `Received "changeSO2CleanerLvl" event with payload: ${JSON.stringify(
            payload
          )}`
        );
        this.CleanerSO2Lvl = payload.Lvl;
      }
    },
    "device.changeNO2CleanerLvl": {
      group: "other",
      handler(payload) {
        console.log(
          `Received "changeNO2CleanerLvl" event with payload: ${JSON.stringify(
            payload
          )}`
        );
        this.CleanerNO2Lvl = payload.Lvl;
      }
    }
  },
  created() {
    // actuator
    this.CleanerCO = false; //CO cleaner on/off
    this.CleanerSO2 = false; //SO2 cleaner on/off
    this.CleanerNO2 = false; //NO2 cleaner on/off

    this.CleanerCOLvl = 0; //CO cleaner % working
    this.CleanerSO2Lvl = 0; //SO2 cleaner % working
    this.CleanerNO2Lvl = 0; //NO2 cleaner % working

    // sensor
    this.sensorId = 1;
    this.IndexCO = 0;
    this.IndexSO2 = 0;
    this.IndexNO2 = 0;
    this.interval = 30000;
    // init
    this.readData();
    this.init();
  }
};
