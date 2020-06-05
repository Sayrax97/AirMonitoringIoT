"use strict";
const fs = require("fs");
let data1;
fs.readFile("../data/dataCO.json", (err, data) => {
  if (err) throw err;
  data1 = JSON.parse(data);
});
setInterval(() => {
  console.log(data1.length);
  let temp = Math.round(Math.random() * data1.length - 1);
  console.log(temp);
  console.log(data1[temp]);
}, 5000);

module.exports = {
  name: "device",
  methods: {
    init() {
      this.loadData();
      setInterval(() => {
        let a = 20;
        let b = 40;
        let temp = Math.floor((b - a) * Math.random()) + a + this.offset;
        this.broker.emit("temperature.read", {
          sensorId: 1,
          temperature: temp,
          timestamp: Date.now()
        });
      }, this.interval);
    },
    loadData() {
      fs.readFile("../data/dataCO.json", (err, data) => {
        if (err) throw err;
        this.data = JSON.parse(data);
      });
    }
  },
  events: {
    "temperature.set.1": {
      group: "other",
      handler(payload) {
        console.log(
          'Recieved "temperature.set.1" event in sensor service with payload: ',
          payload
        );
        this.offset = payload.offset;
      }
    }
  },
  created() {
    this.interval = 5000;
    this.offset = 0;
    this.init();
  }
};
