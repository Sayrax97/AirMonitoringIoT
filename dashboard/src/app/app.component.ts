import { MaxValue } from "./Models/MaxValue";
import { NO2 } from "./Models/NO2";
import { CO } from "./Models/CO";
import { Stats } from "./Models/Stats";
import { GatewayService } from "./../service/gateway.service";
import { Component, OnInit } from "@angular/core";
import { SO2 } from "./Models/SO2";
import * as CanvasJS from "../assets/canvasjs.min";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "dashboard";
  stats: Stats;
  co: CO;
  so2: SO2;
  no2: NO2;
  coSp: CO;
  so2Sp: SO2;
  no2Sp: NO2;
  maxValue: MaxValue;
  dataPointsCO = [];
  dataPointsSO2 = [];
  dataPointsNO2 = [];
  dataPointsCOAQI = [];
  dataPointsSO2AQI = [];
  dataPointsNO2AQI = [];
  dpsLength: number;
  constructor(private gServices: GatewayService) {
    this.dpsLength = 0;
  }

  ngOnInit(): void {
    let dpsLength = 0;
    let chartNO2 = new CanvasJS.Chart("chartNO2", {
      //exportEnabled: true,
      title: {
        text: "NO2",
      },
      data: [
        {
          type: "spline",
          dataPoints: this.dataPointsNO2,
        },
        {
          type: "line",
          dataPoints: this.dataPointsNO2AQI,
        },
      ],
    });
    let chartCO = new CanvasJS.Chart("chartCO", {
      //exportEnabled: true,
      title: {
        text: "CO",
      },
      data: [
        {
          type: "spline",
          dataPoints: this.dataPointsCO,
        },
        {
          type: "line",
          dataPoints: this.dataPointsCOAQI,
        },
      ],
    });
    let chartSO2 = new CanvasJS.Chart("chartSO2", {
      //exportEnabled: true,
      title: {
        text: "SO2",
      },
      data: [
        {
          type: "spline",
          dataPoints: this.dataPointsSO2,
        },
        {
          type: "line",
          dataPoints: this.dataPointsSO2AQI,
        },
      ],
    });

    this.gServices.getStats().subscribe((res) => {
      this.stats = res;
      this.updateChart(this.stats.sendorID, chartCO, chartSO2, chartNO2);
    });
    this.gServices.getMaxValue().subscribe((res) => {
      this.maxValue = res[0];
    });
  }

  updateChart(
    id: number,
    chart1: CanvasJS.Chart,
    chart2: CanvasJS.Chart,
    chart3: CanvasJS.Chart
  ) {
    let that = this;
    this.gServices.getSO2Sp(this.stats.sendorID).subscribe((res) => {
      this.so2Sp = res[0];
      this.dataPointsSO2.push({
        x: this.dataPointsSO2.length,
        y: this.so2Sp.SO2_Con,
      });
      this.dataPointsSO2AQI.push({
        x: this.dataPointsSO2AQI.length,
        y: this.so2Sp.SO2_AQI,
      });
      //console.log(this.so2Sp.SO2_Con);
      if (this.dataPointsSO2.length > 20) {
        this.dataPointsSO2.shift();
        this.dataPointsSO2AQI.shift();
      }
      chart1.render();
    });
    this.gServices.getCOSp(this.stats.sendorID).subscribe((res) => {
      this.coSp = res[0];
      this.dataPointsCO.push({
        x: this.dataPointsCO.length,
        y: this.coSp.CO_Con,
      });
      this.dataPointsCOAQI.push({
        x: this.dataPointsCOAQI.length,
        y: this.coSp.CO_AQI,
      });

      if (this.dataPointsCO.length > 20) {
        this.dataPointsCO.shift();
        this.dataPointsCOAQI.shift();
      }
      chart2.render();
    });
    this.gServices.getNO2Sp(this.stats.sendorID).subscribe((res) => {
      this.no2Sp = res[0];
      this.dataPointsNO2.push({
        x: this.dataPointsNO2.length,
        y: this.no2Sp.NO2_Con,
      });
      this.dataPointsNO2AQI.push({
        x: this.dataPointsNO2AQI.length,
        y: this.no2Sp.NO2_AQI,
      });
      //console.log(this.no2Sp.NO2_Con);
      if (this.dataPointsNO2.length > 20) {
        this.dataPointsNO2.shift();
        this.dataPointsNO2AQI.shift();
      }
      chart3.render();
    });

    setTimeout(function () {
      that.updateChart(id, chart1, chart2, chart3);
    }, 5000);
  }
}
