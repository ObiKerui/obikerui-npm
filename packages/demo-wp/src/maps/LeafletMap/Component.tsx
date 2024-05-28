/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLayoutEffect, useRef, useState } from 'react';
import * as d3MapLib from '@obikerui/d3-map-lib';
import * as d3 from 'd3';

type tData = {
  wards: unknown;
  properties: unknown;
};

async function loadData() {
  const geojson = await d3.json('assets/NE.geojson');
  const json = (await d3.json('assets/properties.geojson')) as any;

  return {
    wards: geojson,
    properties: json.data,
  } as tData;
}

function createChart() {
  const container = new d3MapLib.LeafletContainer();
  container.addPlot(new d3MapLib.Path());
  container.addPlot(new d3MapLib.CMarkers());

  container.attrs = {
    ...container.attrs,
  };
  container.update();
  return container;
}

function updateChart(
  chart: d3MapLib.LeafletContainer,
  html: HTMLDivElement,
  data: tData
) {
  const paths = chart.getPlots()[0];
  paths.attrs = {
    ...paths.attrs,
    geojson: data.wards,
    style: 'stroke: Orange; stroke-width: 1px; fill-opacity: .1; fill: blue;',
  } as d3MapLib.tPlotAttrs;

  const markers = chart.getPlots()[1];
  markers.attrs = {
    ...markers.attrs,
    json: data.properties,
    onDrawMarker: () => d3.symbol().type(d3.symbolCircle).size(45)(),
  } as d3MapLib.tPlotAttrs;

  const updatedAttrs = {
    ...chart.attrs,
    html,
  } as d3MapLib.tContainerAttrs;
  // eslint-disable-next-line no-param-reassign
  chart.attrs = updatedAttrs;
  chart.update();

  return chart;
}

function LeafletMap() {
  const ref = useRef<HTMLDivElement | null>(null);
  const chart = useRef<d3MapLib.LeafletContainer>(createChart());
  const [chartAttrs, setChartAttrs] = useState<d3MapLib.tContainerAttrs | null>(
    null
  );

  useLayoutEffect(() => {
    if (ref.current === null) {
      return;
    }

    loadData()
      .then((data) => {
        if (!ref.current) {
          return;
        }
        const updated = updateChart(chart.current, ref.current, data);
        setChartAttrs(updated.attrs);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <span>Leaflet Map</span>
      <div className="flex">
        <div className="h-[400px] w-[800px]" ref={ref} />
      </div>
    </div>
  );
}

export { LeafletMap };
