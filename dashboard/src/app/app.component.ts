import { MaxValue } from "./Models/MaxValue";
import { NO2 } from "./Models/NO2";
import { CO } from "./Models/CO";
import { Stats } from "./Models/Stats";
import { GatewayService } from "./../service/gateway.service";
import { Component, OnInit } from "@angular/core";
import { SO2 } from "./Models/SO2";
import * as CanvasJS from "../assets/canvasjs.min";

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
  maxValue: MaxValue;
  constructor(private gServices: GatewayService) {}

  ngOnInit(): void {
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Basic Column Chart in Angular"
      },
      data: [
        {
          type: "column",
          dataPoints: [
            { y: 71, label: "Apple" },
            { y: 55, label: "Mango" },
            { y: 50, label: "Orange" },
            { y: 65, label: "Banana" },
            { y: 95, label: "Pineapple" },
            { y: 68, label: "Pears" },
            { y: 28, label: "Grapes" },
            { y: 34, label: "Lychee" },
            { y: 14, label: "Jackfruit" }
          ]
        }
      ]
    });

    chart.render();
    // this.gServices.getStats().subscribe(res => {
    //   this.stats = res;

    //   this.gServices.getCO(this.stats.sendorID).subscribe(res => {
    //     this.co = res;
    //   });
    //   this.gServices.getNO2(this.stats.sendorID).subscribe(res => {
    //     this.so2 = res;
    //   });
    //   this.gServices.getSO2(this.stats.sendorID).subscribe(res => {
    //     this.no2 = res;
    //   });
    // });
    // this.gServices.getMaxValue().subscribe(res => {
    //   this.maxValue = res;
    // });
  }
}
