import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class GatewayService {
  url = "http://localhost:3000/";

  constructor(private httpClint: HttpClient) {}

  getCO(id: number) {
    return this.httpClint.get<any>(this.url + `co/${id}`);
  }
  getNO2(id: number) {
    return this.httpClint.get<any>(this.url + `no2/${id}`);
  }
  getSO2(id: number) {
    return this.httpClint.get<any>(this.url + `so2/${id}`);
  }
  getCO(id: number) {
    return this.httpClint.get<any>(this.url + `co/new`);
  }
  getNO2(id: number) {
    return this.httpClint.get<any>(this.url + `no2/new`);
  }
  getSO2(id: number) {
    return this.httpClint.get<any>(this.url + `so2/new`);
  }
  getStats() {
    return this.httpClint.get<any>(this.url + `stats`);
  }
  getMaxValue() {
    return this.httpClint.get<any>(this.url + `max_value/all`);
  }
}
