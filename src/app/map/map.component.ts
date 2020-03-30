import { Component, OnInit, AfterViewInit } from "@angular/core";

import * as L from "leaflet";
import { DrawService } from "../services/draw.service";
import { disableMapMove, enableMapMove } from "../../util/map";
import { angle, lerp } from "../../util/geom";
import { getRotatedIconHTML } from "../../util/leaflet";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements AfterViewInit {
  private map: L.Map;
  private currentPoints: L.LatLngExpression[] = [];
  private polyline = new L.Polyline(this.currentPoints);
  private marker: L.Marker;
  private currentAngle = 0;
  private start: number = NaN;
  private duration: number = 500;

  private from: L.LatLngExpression;
  private to: L.LatLngExpression;

  private currentDestination: L.LatLngExpression;

  constructor(private drawService: DrawService) {}

  ngAfterViewInit(): void {
    this.initMap();

    this.currentPoints = this.drawService.getFakeRoute().slice();
    this.addPolylineRoute();
    this.addCar();
    // this.drawService.onDrawToggleSignal.add(this.onDrawToggle);
    this.processNextPoint();
    
  }

  private processNextPoint = () => {
    this.from = this.to ? this.to : this.currentPoints.shift();
    this.to = this.currentPoints.shift();
    if (!this.to) {
      this.currentPoints = this.drawService.getFakeRoute().slice();
      this.processNextPoint();
      return;
    }

    const pointA = this.map.latLngToContainerPoint(this.from);
    const pointB = this.map.latLngToContainerPoint(this.to);
    // const vector = new L.Point(pointB.x - pointA.x, pointB.y - pointA.y);
    if (this.to) {
      this.rotate(this.from, this.to);
    }

    if (this.to) {
      requestAnimationFrame(this.animate);
    }
  }
  
  private addCar = () => {
    this.marker = new L.Marker(this.currentPoints[0], {
      icon: L.divIcon({
        iconAnchor: [25, 25],
        html: ``
      })
    });
    this.marker.addTo(this.map);
  };

  private addPolylineRoute = () => {
    this.polyline.setLatLngs(this.drawService.getFakeRoute());
    this.polyline.addTo(this.map);
  };

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
  }

  rotate = (from: L.LatLngExpression, to: L.LatLngExpression) => {
    const icon = this.marker.getIcon() as L.DivIcon;
    const route = this.currentPoints;
    this.currentAngle = angle(this.map, from, to) + 95;
    const html = getRotatedIconHTML(
      "assets/icon_50.png",
      50,
      this.currentAngle
    );
    icon.options.html = html;
    this.marker.setIcon(icon);
  };

  moveMarker = (from: L.LatLngExpression, to: L.LatLngExpression) => {

  }

  animate = (deltaTime: number) => {
    if (isNaN(this.start)) {
      this.start = deltaTime;
    }
    const ratio = (deltaTime - this.start) / this.duration;
    const pointA = this.map.latLngToContainerPoint(this.to);
    const pointB = this.map.latLngToContainerPoint(this.marker.getLatLng());


    if (ratio >= 1) {
      this.start = NaN;
      this.processNextPoint();
      return;
    }
    const l = lerp(this.map, this.from, this.to, ratio);
    
    this.currentDestination = this.to;
  //  console.log((deltaTime - this.start) / this.duration);
    this.rotate(this.from, this.to);
    this.marker.setLatLng(l);
    requestAnimationFrame(this.animate);
  };
}
