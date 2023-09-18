/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import * as d3 from 'd3';
import * as d3MapLib from '@obikerui/d3-map-lib';

export default async function createMap(ref: HTMLDivElement) {
  const geojson = await d3.json('assets/NE.geojson');
  const propData: any = await d3.json('assets/properties.geojson');

  const pois = (d3MapLib.MapMarkers() as any).json(propData.data);

  // const wards = (d3MapLib.MapLayer() as any).geojson(geojson).onStyle((args: any) => {
  //   const { zoomLevel } = args;
  //   const strokeWidth = zoomLevel > 8 ? '1px' : '0.1px';
  //   const fillOpacity = zoomLevel > 8 ? '.3' : '.4';
  //   return `
  //     stroke: blue;
  //     stroke-width: ${strokeWidth};
  //     fill-opacity: ${fillOpacity};
  //     fill: gray;
  //   `;
  // });

  const wards = d3MapLib.MapLayer().geojson(geojson);

  const container = d3MapLib
    .Container()
    .position([54.9783, -1.6178])
    .viewType('mapbox/satellite-v9')
    .zoom(8)
    .plot(wards)
    .plot(pois);

  d3.select(ref).call(container);
  return container;
}
