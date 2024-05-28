/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  const markers = chart.getPlots()[0];
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

function refreshChart(chart: d3MapLib.LeafletContainer) {
  chart.update();
}

function PropertyMap({ checked }: { checked: boolean }) {
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

  useEffect(() => {
    if (checked && chart.current) {
      refreshChart(chart.current);
    }
  }, [checked]);

  return (
    <div>
      <span>Leaflet Map</span>
      <div className="flex">
        <div className="h-[400px] w-[800px]" ref={ref} />
      </div>
    </div>
  );
}

export { PropertyMap };

// function TempRoadmap() {
//   return (
//     <div>
//       <div>
//         <h1 className="py-1 font-bold">Calculations</h1>
//         <ul>
//           <li>
//             <b>Cash Flow</b> - Profit or the Income minus the Costs
//           </li>
//           <li>
//             <b>Gross Yield</b> - Income &divide; Property Value - Quick/dirty
//             idea of quality without costs
//           </li>
//           <li>
//             <b>Net Yield</b> - Profit &divide; Property Value - Factor in the
//             costs
//           </li>
//           <li>
//             <b>Capitalisation Rate (Cap Rate)</b> - Exclude the mortgage
//             payments
//           </li>
//           <li>
//             <b>Return on Investment (ROI)</b> - Only divide by the money
//             invested (deposit)
//           </li>
//           <li>
//             <b>Payback Period 1 &divide; ROI</b> - ROI based estimate of how
//             long to pay off
//           </li>
//           <li>
//             <b>Capital Growth</b> - Factors that will affect growth?
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }
