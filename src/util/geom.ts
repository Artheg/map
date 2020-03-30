import * as L from "leaflet";

export const angle = (
  map: L.Map,
  latlngA: L.LatLngExpression,
  latlngB: L.LatLngExpression
) => {
  const pointA = map.latLngToContainerPoint(latlngA);
  const pointB = map.latLngToContainerPoint(latlngB);
  let angleDeg =
    (Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x) * 180) / Math.PI + 90;
  angleDeg += angleDeg < 0 ? 360 : 0;
  return angleDeg;
};

export const lerp = (
  map: L.Map,
  a: L.LatLngExpression,
  b: L.LatLngExpression,
  duration: number
) => {
  const pointA = map.latLngToContainerPoint(a);
  const pointB = map.latLngToContainerPoint(b);

  const reusltPoint = new L.Point(
    pointA.x + (pointB.x - pointA.x) * duration,
    pointA.y + (pointB.y - pointA.y) * duration
  );
  const result = map.containerPointToLatLng(reusltPoint);
  return result;
};
