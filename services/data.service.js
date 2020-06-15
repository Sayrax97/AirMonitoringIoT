"use strict";

const request = require("request");
const Influx = require("influx");

module.exports = {
  name: "data",
  actions: {
    readCO: {
      params: {
        sensorId: { type: "number" }
      },
      async handler(ctx) {
        try {
          const res = await this.influx.query(
            `select * from co where sensorId=${ctx.params.sensorId}`
          );
          return res;
        } catch (err) {
          console.log(err);
          return null;
        }
      }
    },
    readNO2: {
      params: {
        sensorId: { type: "number" }
      },
      async handler(ctx) {
        try {
          const res = await this.influx.query(
            `select * from no2 where sensorId=${ctx.params.sensorId}`
          );
          return res;
        } catch (err) {
          console.log(err);
          return null;
        }
      }
    },
    readSO2: {
      params: {
        sensorId: { type: "number" }
      },
      async handler(ctx) {
        try {
          const res = await this.influx.query(
            `select * from so2 where sensorId=${ctx.params.sensorId}`
          );
          return res;
        } catch (err) {
          console.log(err);
          return null;
        }
      }
    }
  },
  methods: {
    sendParameters(
      CO_Con,
      CO_AQI,
      SO2_Con,
      SO2_AQI,
      NO2_Con,
      NO2_AQI,
      sensorId
    ) {
      const body = {
        CO_Con: CO_Con,
        CO_AQI: CO_AQI,
        SO2_Con: SO2_Con,
        SO2_AQI: SO2_AQI,
        NO2_Con: NO2_Con,
        NO2_AQI: NO2_AQI,
        sensorId: sensorId
      };
      console.log(body);
      request.post(
        process.env.ANALYTICS_URL,
        {
          json: body
        },
        (err, res, body) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(res.statusCode);
          console.log(body);
        }
      );
    }
  },
  events: {
    "device.parametersRead": {
      group: "other",
      handler(payload) {
        console.log(
          'Received "device.parametersRead" event with payload: ',
          payload
        );
        this.influx.writePoints([
          {
            measurement: "co",
            fields: {
              sensorId: payload.sensorId,
              CO_Con: payload.CO_Con,
              CO_AQI: payload.CO_AQI,
              CO_AQS_Name: payload.CO_AQS_Name
            },
            time: payload.Time
          },
          {
            measurement: "so2",
            fields: {
              sensorId: payload.sensorId,
              SO2_Con: payload.SO2_Con,
              SO2_AQI: payload.SO2_AQI,
              SO2_AQS_Name: payload.SO2_AQS_Name
            },
            time: payload.Time
          },
          {
            measurement: "no2",
            fields: {
              sensorId: payload.sensorId,
              NO2_Con: payload.NO2_Con,
              NO2_AQI: payload.NO2_AQI,
              NO2_AQS_Name: payload.NO2_AQS_Name
            },
            time: payload.Time
          }
        ]);
        this.sendParameters(
          payload.CO_Con,
          payload.CO_AQI,
          payload.SO2_Con,
          payload.SO2_AQI,
          payload.NO2_Con,
          payload.NO2_AQI,
          payload.sensorId
        );
      }
    }
  },
  created() {
    this.influx = new Influx.InfluxDB({
      host: process.env.INFLUXDB_HOST || "influx",
      database: process.env.INFLUXDB_DATABASE || "air_emission",
      username: process.env.ADMIN_USER || "admin",
      password: process.env.ADMIN_PASSWORD || "admin",
      schema: [
        {
          measurement: "co",
          fields: {
            sensorId: Influx.FieldType.INTEGER,
            CO_Con: Influx.FieldType.FLOAT,
            CO_AQI: Influx.FieldType.FLOAT,
            CO_AQS_Name: Influx.FieldType.STRING
          },
          tags: ["host"]
        },
        {
          measurement: "so2",
          fields: {
            sensorId: Influx.FieldType.INTEGER,
            SO2_Con: Influx.FieldType.FLOAT,
            SO2_AQI: Influx.FieldType.FLOAT,
            SO2_AQS_Name: Influx.FieldType.STRING
          },
          tags: ["host"]
        },
        {
          measurement: "no2",
          fields: {
            sensorId: Influx.FieldType.INTEGER,
            NO2_Con: Influx.FieldType.FLOAT,
            NO2_AQI: Influx.FieldType.FLOAT,
            NO2_AQS_Name: Influx.FieldType.STRING
          },
          tags: ["host"]
        }
      ]
    });
    this.influx.getDatabaseNames().then(names => {
      if (!names.includes("air_emission")) {
        return this.influx.createDatabase("air_emission");
      }
      return null;
    });
  }
};
