import { Injectable } from "@angular/core";
import Signal from "../../util/signal";
import { route } from "./mock.data";

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor() {}

  public getFakeRoute = () => {
    return route.slice();
  };
}
