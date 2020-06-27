import { MaxValue } from "./Models/MaxValue";
import { NO2 } from "./Models/NO2";
import { CO } from "./Models/CO";
import { Stats } from "./Models/Stats";
import { GatewayService } from "./../service/gateway.service";
import { Component, OnInit } from "@angular/core";
import { SO2 } from "./Models/SO2";
import * as CanvasJS from "../assets/canvasjs.min";
import { Socket } from "ngx-socket-io";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
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
  constructor(private gServices: GatewayService, private socket: Socket) {
    this.dpsLengthCO = 0;
    this.dpsLengthNO2 = 0;
    this.dpsLengthSO2 = 0;
  }
  dataPointsCO = [];
  dataPointsSO2 = [];
  dataPointsNO2 = [];
  dataPointsCOAQI = [];
  dataPointsSO2AQI = [];
  dataPointsNO2AQI = [];
  dpsLengthCO: number;
  dpsLengthSO2: number;
  dpsLengthNO2: number;

  ngOnInit(): void {
    let dpsLength = 0;
    let chartNO2 = new CanvasJS.Chart("chartNO2", {
      //exportEnabled: true,
      title: {
        text: "NO2"
      },
      data: [
        {
          type: "spline",
          dataPoints: this.dataPointsNO2
        },
        {
          type: "line",
          dataPoints: this.dataPointsNO2AQI
        }
      ]
    });
    let chartCO = new CanvasJS.Chart("chartCO", {
      //exportEnabled: true,
      title: {
        text: "CO"
      },
      data: [
        {
          type: "spline",
          dataPoints: this.dataPointsCO
        },
        {
          type: "line",
          dataPoints: this.dataPointsCOAQI
        }
      ]
    });
    let chartSO2 = new CanvasJS.Chart("chartSO2", {
      //exportEnabled: true,
      title: {
        text: "SO2"
      },
      data: [
        {
          type: "spline",
          dataPoints: this.dataPointsSO2
        },
        {
          type: "line",
          dataPoints: this.dataPointsSO2AQI
        }
      ]
    });
    this.updateChart(chartCO, chartSO2, chartNO2);
    this.gServices.getMaxValue().subscribe(res => {
      this.maxValue = res[0];
    });
  }

  updateChart(
    chart1: CanvasJS.Chart,
    chart2: CanvasJS.Chart,
    chart3: CanvasJS.Chart
  ) {
    let that = this;
    this.gServices.getStats().subscribe(res => {
      this.stats = res;

      document.getElementById(
        "senzorID"
      ).innerHTML = this.stats.sendorID.toString();

      if (this.stats.CleanerCO)
        document.getElementById("CleanerCO").innerHTML = "On";
      else document.getElementById("CleanerCO").innerHTML = "Off";
      document.getElementById(
        "CleanerCOLvl"
      ).innerHTML = this.stats.CleanerCOLvl.toString();

      this.socket.fromEvent("new.data").subscribe(data => {
        console.log(data);
      });
      this.socket.fromEvent("warning").subscribe(data => {
        console.log(data);
      });
      this.socket.fromEvent("actuator").subscribe(data => {
        console.log(data);
      });
      // this.gServices.getStats().subscribe(res => {
      //   this.stats = res;
      if (this.stats.CleanerNO2)
        document.getElementById("CleanerNO2").innerHTML = "On";
      else document.getElementById("CleanerNO2").innerHTML = "Off";
      document.getElementById(
        "CleanerNO2Lvl"
      ).innerHTML = this.stats.CleanerNO2Lvl.toString();

      if (this.stats.CleanerSO2)
        document.getElementById("CleanerSO2").innerHTML = "On";
      else document.getElementById("CleanerSO2").innerHTML = "Off";
      document.getElementById(
        "CleanerSO2Lvl"
      ).innerHTML = this.stats.CleanerSO2Lvl.toString();

      this.gServices.getSO2Sp(this.stats.sendorID).subscribe(res => {
        this.so2Sp = res[0];
        this.dataPointsSO2.push({
          x: this.dpsLengthSO2,
          y: this.so2Sp.SO2_Con
        });
        this.dataPointsSO2AQI.push({
          x: this.dpsLengthSO2,
          y: this.so2Sp.SO2_AQI
        });
        //console.log(this.so2Sp.SO2_Con);
        if (this.dataPointsSO2.length > 20) {
          this.dataPointsSO2.shift();
          this.dataPointsSO2AQI.shift();
        }
        chart1.render();
      });
      this.gServices.getCOSp(this.stats.sendorID).subscribe(res => {
        this.coSp = res[0];
        this.dataPointsCO.push({
          x: this.dpsLengthCO,
          y: this.coSp.CO_Con
        });
        this.dataPointsCOAQI.push({
          x: this.dpsLengthCO,
          y: this.coSp.CO_AQI
        });

        if (this.dataPointsCO.length > 20) {
          this.dataPointsCO.shift();
          this.dataPointsCOAQI.shift();
        }
        chart2.render();
      });
      this.gServices.getNO2Sp(this.stats.sendorID).subscribe(res => {
        this.no2Sp = res[0];
        this.dataPointsNO2.push({
          x: this.dpsLengthNO2,
          y: this.no2Sp.NO2_Con
        });
        this.dataPointsNO2AQI.push({
          x: this.dpsLengthNO2,
          y: this.no2Sp.NO2_AQI
        });
        //console.log(this.no2Sp.NO2_Con);
        if (this.dataPointsNO2.length > 20) {
          this.dataPointsNO2.shift();
          this.dataPointsNO2AQI.shift();
        }
        chart3.render();
      });
    });
    this.dpsLengthCO++;
    this.dpsLengthNO2++;
    this.dpsLengthSO2++;
    setTimeout(function() {
      that.updateChart(chart1, chart2, chart3);
    }, 5000);
  }
}
