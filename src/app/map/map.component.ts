import { Component, OnInit, AfterViewInit } from "@angular/core";

import * as L from "leaflet";
import { DataService } from "../services/draw.service";
import { disableMapMove, enableMapMove } from "../../util/map";
import { angle, lerp } from "../../util/geom";
import { getRotatedIconHTML } from "../../util/leaflet";

type MapPoint = L.LatLngExpression & { time: number };

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements AfterViewInit {
  private map: L.Map;
  private marker: L.Marker;

  private currentPoints: MapPoint[] = [];
  private polyline = new L.Polyline(this.currentPoints);
  
  private currentAngle = 0;
  private startTime = NaN;
  private duration = 500;

  private from: MapPoint;
  private to: MapPoint;

  constructor(private drawService: DataService) {}

  ngAfterViewInit(): void {
    this.initMap();

    this.addPolylineRoute();
    this.addCar();
    this.processNextPoint();
  }

  private initMap = () => {
    this.map = L.map("map", {
      center: [40.73061, -73.935242],
      zoom: 16
    });
    const tiles = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19
      }
    );
    tiles.addTo(this.map);
  };

  private addPolylineRoute = () => {
    this.currentPoints = this.drawService.getFakeRoute().slice();
    this.polyline.setLatLngs(this.currentPoints);
    this.polyline.addTo(this.map);
  };

  private addCar = () => {
    this.marker = new L.Marker(this.currentPoints[0], {
      icon: L.divIcon({
        iconAnchor: [32, 32],
        html: getRotatedIconHTML("assets/icon_64.png", 64, this.currentAngle)
      })
    });
    this.marker.addTo(this.map);
    this.marker.bindPopup("<b>Model</b><br>DMC DeLorean.");
  };

  private processNextPoint = () => {
    this.from = this.to ? this.to : this.currentPoints.shift();
    this.to = this.currentPoints.shift();
    if (!this.to) {
      this.currentPoints = this.drawService.getFakeRoute();
      this.processNextPoint();
      return;
    }
    this.rotate(this.from, this.to);
    requestAnimationFrame(this.animate);
  };

  private rotate = (from: MapPoint, to: MapPoint) => {
    const icon = this.marker.getIcon() as L.DivIcon;
    this.currentAngle = angle(this.map, from, to);
    const html = getRotatedIconHTML(
      "assets/icon_64.png",
      64,
      this.currentAngle
    );
    icon.options.html = html;
    this.marker.setIcon(icon);
  };

  private animate = (deltaTime: number) => {
    if (isNaN(this.startTime)) {
      this.startTime = deltaTime;
    }
    const ratio = (deltaTime - this.startTime) / (this.to.time * 1000);

    if (ratio >= 1) {
      this.startTime = NaN;
      this.processNextPoint();
      return;
    }
    const step = lerp(this.map, this.from, this.to, ratio);
    this.rotate(this.from, this.to);
    this.marker.setLatLng(step);
    requestAnimationFrame(this.animate);
  };
}
