import { Injectable } from "@angular/core";
import Signal from "../../util/signal";
import { route } from './mock.data';

@Injectable({
  providedIn: "root"
})
export class DrawService {
  public onDrawToggleSignal: Signal<boolean> = new Signal();
  private isDrawing: boolean;
  constructor() {}

  public onDrawClick = () => {
    this.isDrawing = !this.isDrawing;
    this.onDrawToggleSignal.dispatch(this.isDrawing);
    console.log("click", this.isDrawing);
  };

  public getFakeRoute = () => {
    return route;
  }
}
