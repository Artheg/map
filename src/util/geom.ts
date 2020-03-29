import * as L from "leaflet";

export const angle = (map: L.Map, latlngA: L.LatLngExpression, latlngB: L.LatLngExpression)  => {
    const pointA = map.latLngToContainerPoint(latlngA);
    const pointB = map.latLngToContainerPoint(latlngB);
    let angleDeg = Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x) * 180 / Math.PI + 90;
    angleDeg += angleDeg < 0 ? 360 : 0;
    return angleDeg;
}