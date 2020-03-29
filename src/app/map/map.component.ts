import { Component, OnInit, AfterViewInit } from "@angular/core";

import * as L from "leaflet";
import { DrawService } from "../services/draw.service";
import { disableMapMove, enableMapMove } from "../../util/map";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements AfterViewInit {
  private map: L.Map;
  private currentPoints: L.LatLngExpression[] = [];
  private polyline = new L.Polyline(this.currentPoints);

  constructor(private drawService: DrawService) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.polyline.setLatLngs(this.drawService.getFakeRoute());
    this.polyline.redraw();

    this.drawService.onDrawToggleSignal.add(this.onDrawToggle);
  }

  private onDrawToggle = (isDrawing: boolean) => {
    if (isDrawing) {
      disableMapMove(this.map);
      this.map.on("click", this.drawPolyline);
    } else {
      enableMapMove(this.map);
      this.map.off("click", this.drawPolyline);
    }
  };

  private drawPolyline = (event: L.LeafletEvent) => {
    this.currentPoints.push(event["latlng"]);
    this.polyline.setLatLngs(this.currentPoints);
    this.polyline.redraw();
    console.log(this.polyline.getLatLngs());
  };

  private initMap(): void {
    this.map = L.map("map", {
      center: [40.73061, -73.935242],
      zoom: 16
    });
    console.log("map init");
    const tiles = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19
      }
    );

    tiles.addTo(this.map);
    this.polyline.addTo(this.map);
  }
}
