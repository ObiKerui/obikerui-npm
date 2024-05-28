/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLayoutEffect, useRef, useState } from 'react';
import * as d3MapLib from '@obikerui/d3-map-lib';
import * as d3 from 'd3';

type tData = {
  states: unknown;
  counties: unknown;
};

async function loadData() {
  // create the states geojson
  const statesGeojson: any = await d3.json('assets/us-states.geojson');
  const featuresArr = statesGeojson.features;

  // filter out Alaska, Hawaii and Puerto Rico to fit on Canvas
  const filteredFeaturesArr = featuresArr.filter((elem: any) => {
    const { name } = elem.properties;
    return name !== 'Alaska' && name !== 'Hawaii' && name !== 'Puerto Rico';
  }) as unknown[];

  const statesGeojsonCopy = { ...statesGeojson };
  statesGeojsonCopy.features = filteredFeaturesArr;

  // create the counties geojson
  const countiesGeojson: any = await d3.json('assets/us-counties.geojson');
  const countiesFeatureArr = countiesGeojson.features;
  const filteredCounties = countiesFeatureArr.filter((elem: any) => {
    const stateId = elem.properties.STATEFP;
    return stateId !== '02' && stateId !== '15' && stateId !== '72';
  }) as unknown[];

  const countiesGeojsonCopy = { ...countiesGeojson };
  countiesGeojsonCopy.features = filteredCounties;

  // add the unemployment rate data
  const unemploymentCsv = await d3.csv('assets/unemployment-x.csv');

  //   const minMaxUnemploymentRate = d3.extent(
  //     unemploymentCsv,
  //     (elem: any) => +elem.rate
  //   );

  //   const colorScale = d3
  //     .scaleSequential((t: any) =>
  //       // return d3.interpolateViridis(t)
  //       d3.interpolateReds(t)
  //     )
  //     .domain([minMaxUnemploymentRate[0], minMaxUnemploymentRate[1]])

  // match up the unemployment rate with the county
  for (let i = 0; i < countiesGeojsonCopy.features.length; i += 1) {
    const county = countiesGeojsonCopy.features[i];
    const countyGeoID = county.properties.GEOID;
    let j = 0;
    for (; j < unemploymentCsv.length; j += 1) {
      const unemploymentInCounty = unemploymentCsv[j];
      const { id } = unemploymentInCounty;
      const { rate } = unemploymentInCounty;

      if (id === countyGeoID) {
        county.properties.rate = +(rate ?? 0);
        break;
      }
    }
  }

  return {
    states: statesGeojsonCopy,
    counties: countiesGeojsonCopy,
  };

  //   const projector = d3PlotLib.DevMapProjection().projection(d3.geoAlbers())

  //   const counties = (d3PlotLib.DevMapLayer() as any)
  //     .geojson(statesGeojsonCopy)
  //     .onStyle(() => `stroke: Brown; stroke-width: .4; fill-opacity: 0;`)

  //   const unemployment = (d3PlotLib.DevMapLayer() as any)
  //     .geojson(countiesGeojsonCopy)
  //     .onStyle((args: any) => {
  //       const { elem } = args
  //       const { rate } = elem.properties
  //       const colour = colorScale(rate)
  //       return `
  //         stroke: Orange;
  //         stroke-width: .1;
  //         fill-opacity: 1;
  //         fill: ${colour};
  //       `
  //     })

  //   const zoomer = d3PlotLib.DevZoom()

  //   const container = (d3PlotLib.DevMapContainer() as any)
  //     .margin({ left: 10, right: 10, top: 10, bottom: 10 })
  //     .zoomer(zoomer)
  //     .projector(projector)
  //     .plot(unemployment)
  //     .plot(counties)
}

function createChart() {
  const container = new d3MapLib.BaseContainer();
  container.addPlot(new d3MapLib.CMapLayer());
  // container.addPlot(new d3MapLib.CMapLayer());

  container.attrs = {
    ...container.attrs,
  };
  container.update();
  return container;
}

function updateChart(
  chart: d3MapLib.BaseContainer,
  html: HTMLDivElement,
  data: tData
) {
  console.log('data for density map: ', data);

  const geojson = data.states as { features: unknown[] };
  // const restrictedStates = geojson.features.slice(0, 44);
  const restrictedStates = geojson.features.slice(0, 44);
  console.log('what is problem feature: ', geojson.features[45]);
  const newGeojson = {
    type: 'FeatureCollection',
    features: restrictedStates,
  } as any;

  console.log('states vs restricted: ', data.states, newGeojson);

  const states = chart.getPlots()[0];
  states.attrs = {
    ...states.attrs,
    geojson: newGeojson,
    style: 'stroke: Orange; stroke-width: 1px; fill-opacity: .1; fill: blue;',
  } as d3MapLib.tPlotAttrs;

  // const counties = chart.getPlots()[1];
  // counties.attrs = {
  //   ...counties.attrs,
  //   json: data.counties,
  //   //   onDrawMarker: () => d3.symbol().type(d3.symbolCircle).size(45)(),
  // } as d3MapLib.tPlotAttrs;

  const updatedAttrs = {
    ...chart.attrs,
    html,
    chartWidth: 1000,
    chartHeight: 500,
  } as d3MapLib.tContainerAttrs;
  // eslint-disable-next-line no-param-reassign
  chart.attrs = updatedAttrs;
  chart.update();

  return chart;
}

function DensityMap() {
  const ref = useRef<HTMLDivElement | null>(null);
  const chart = useRef<d3MapLib.BaseContainer>(createChart());
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
      <span>Density Map</span>
      <div className="flex">
        <div className="h-[400px] w-[800px]" ref={ref} />
      </div>
    </div>
  );
}

export { DensityMap };
