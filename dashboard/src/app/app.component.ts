import { MaxValue } from "./Models/MaxValue";
import { NO2 } from "./Models/NO2";
import { CO } from "./Models/CO";
import { Stats } from "./Models/Stats";
import { GatewayService } from "./../service/gateway.service";
import { Component, OnInit } from "@angular/core";
import { SO2 } from "./Models/SO2";

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
  constructor(private gServices: GatewayService) {}

  ngOnInit(): void {
    this.gServices.getStats().subscribe((res) => {
      this.stats = res;

      this.gServices.getCO(this.stats.sendorID).subscribe((res) => {
        this.co = res;
      });
      this.gServices.getNO2(this.stats.sendorID).subscribe((res) => {
        this.so2 = res;
      });
      this.gServices.getSO2(this.stats.sendorID).subscribe((res) => {
        this.no2 = res;
      });
      this.gServices.getCOSp(this.stats.sendorID).subscribe((res) => {
        this.coSp = res;
      });
      this.gServices.getNO2Sp(this.stats.sendorID).subscribe((res) => {
        this.so2Sp = res;
      });
      this.gServices.getSO2Sp(this.stats.sendorID).subscribe((res) => {
        this.no2Sp = res;
      });
    });
    this.gServices.getMaxValue().subscribe((res) => {
      this.maxValue = res;
    });

    let dataPoints = [];
    let dpsLength = 0;
    let chart = new CanvasJS.Chart("chartContainer", {
      exportEnabled: true,
      title: {
        text: "Live Chart with Data-Points from External JSON",
      },
      data: [
        {
          type: "spline",
          dataPoints: dataPoints,
        },
      ],
    });

    $.getJSON(
      "https://canvasjs.com/services/data/datapoints.php?xstart=1&ystart=25&length=20&type=json&callback=?",
      function (data) {
        $.each(data, function (key, value) {
          dataPoints.push({ x: value[0], y: parseInt(value[1]) });
        });
        dpsLength = dataPoints.length;
        chart.render();
        updateChart();
      }
    );
    function updateChart() {
      $.getJSON(
        "https://canvasjs.com/services/data/datapoints.php?xstart=" +
          (dpsLength + 1) +
          "&ystart=" +
          dataPoints[dataPoints.length - 1].y +
          "&length=1&type=json&callback=?",
        function (data) {
          $.each(data, function (key, value) {
            dataPoints.push({
              x: parseInt(value[0]),
              y: parseInt(value[1]),
            });
            dpsLength++;
          });

          if (dataPoints.length > 20) {
            dataPoints.shift();
          }
          chart.render();
          setTimeout(function () {
            updateChart();
          }, 1000);
        }
      );
    }
  }
}
