/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { useDensityMap, Metrics, Groupings } from './Map';
import { DataProcessor, tCSVEntry } from './DataProcessor';

type tLoadedMapData = {
  states: unknown;
  counties: unknown;
  unemployment: unknown;
};

async function loadData() {
  // create the states geojson
  const statesGeojson: any = await d3.json('assets/us-states.geojson');

  // filter out Alaska, Hawaii and Puerto Rico to fit on Canvas
  const filteredFeaturesArr = statesGeojson.features.filter((elem: any) => {
    const { name } = elem.properties;
    return name !== 'Alaska' && name !== 'Hawaii';
  }) as unknown[];

  statesGeojson.features = filteredFeaturesArr;

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

  // match up the unemployment rate with the county
  for (let i = 0; i < countiesGeojsonCopy.features.length; i += 1) {
    const county = countiesGeojsonCopy.features[i];
    const countyGeoID = county.properties.GEOID;
    let j = 0;
    for (; j < unemploymentCsv.length; j += 1) {
      const unemploymentInCounty = unemploymentCsv[j];
      const { id, rate } = unemploymentInCounty;

      if (id === countyGeoID) {
        county.properties.rate = +(rate ?? 0);
        break;
      }
    }
  }

  return {
    states: statesGeojson,
    counties: countiesGeojsonCopy,
    unemployment: unemploymentCsv,
  };
}

function Controls() {
  const { metric, setMetric, grouping, setGrouping } = useDensityMap();

  return (
    <div>
      <div className="flex flex-row">
        <details className="dropdown">
          <summary className="btn m-1">{metric as string}</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {Metrics.map((value, id) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setMetric(value as keyof typeof Metrics)}
                >
                  {value}
                </button>
              </li>
            ))}
          </ul>
        </details>
        <details className="dropdown">
          <summary className="btn m-1">{grouping as string}</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {Groupings.map((value, id) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setGrouping(value as keyof typeof Groupings)}
                >
                  {value}
                </button>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}

const dataProcessor = new DataProcessor();

function DensityMap() {
  const ref = useRef<HTMLDivElement | null>(null);

  const {
    setHTML,
    setStatesGeojson,
    setCountiesGeojson,
    setUnemploymentCSV,
    unemploymentCSV,
    setGroupedMetricByCounties,
    setGroupedMetricByStates,
  } = useDensityMap();

  useEffect(() => {
    setHTML(ref.current);
  }, [ref.current]);

  useEffect(() => {
    const setLoadedMapData = (loadedMapData: tLoadedMapData) => {
      setStatesGeojson(loadedMapData.states);
      setCountiesGeojson(loadedMapData.counties);
      setUnemploymentCSV(loadedMapData.unemployment);
    };
    loadData().then(setLoadedMapData).catch(console.error);
  }, []);

  useEffect(() => {
    if (!unemploymentCSV) return;
    const groupedByCounties = dataProcessor.groupByCounties(
      unemploymentCSV as tCSVEntry[]
    );
    setGroupedMetricByCounties(groupedByCounties);

    const groupedByStates = dataProcessor.groupByStates(
      unemploymentCSV as tCSVEntry[]
    );
    setGroupedMetricByStates(groupedByStates);
  }, [unemploymentCSV]);

  return (
    <div>
      <span>Density Map</span>
      <Controls />
      <div className="flex">
        <div className="h-[400px] w-[800px]" ref={ref} />
      </div>
    </div>
  );
}

export { DensityMap };
