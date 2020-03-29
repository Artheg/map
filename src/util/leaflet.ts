export const getRotatedIconHTML = (iconURL: string, size: number, angle: number) => {
  return `<img class="leaflet-marker-icon leaflet-zoom-animated"
           src="${iconURL}"
           style="width: ${size}px;
           height: ${size}px;
           transform: rotate(${angle}deg);
           transform-origin: center;
           -webkit-transform: rotate(${angle}deg);
           -moz-transform:rotate(${angle}deg);" />`;
};
