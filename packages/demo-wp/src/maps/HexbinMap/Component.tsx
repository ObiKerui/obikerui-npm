import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import * as d3MapLib from '@obikerui/d3-map-lib';
// import * as topojson from 'topojson-client';
import { useHexmap, HexbinMap as HexbinMapObj, DetailLevel } from './Map';
import { DataProcessor, tCSVEntry } from './DataProcessor';

type tLoadedMapData = {
  geojson: unknown;
  hexData: unknown;
};

type tGeojson = {
  features: {
    geometry: {
      coordinates: number[][];
    };
  }[];
};

async function loadData() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const USAGeojson: any = await d3.json('assets/Countries/USA.geojson');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const USATopology: any = await d3.json('assets/USA.json');
  // const USAGeojson = topojson.feature(
  //   USATopology,
  //   USATopology.objects.us
  // ) as unknown as tGeojson;

  // extract mainland USA
  const geojsonCopy = JSON.parse(JSON.stringify(USAGeojson));
  const feature = USAGeojson.features[0];
  const coords = feature.geometry.coordinates;
  const mainlandCoords = coords[5][0];
  geojsonCopy.features[0].geometry.coordinates = [[mainlandCoords]];

  const MarketData = await d3.json('assets/markets_overall.json');

  return {
    geojson: geojsonCopy,
    hexData: MarketData,
  } as tLoadedMapData;
}

const hexbinMap = new HexbinMapObj();
const dataProcessor = new DataProcessor();

useHexmap.subscribe((newState) => {
  hexbinMap.update(newState);
});

function Controls() {
  const { detailLevel, setDetailLevel } = useHexmap();
  return (
    <div>
      <div className="flex flex-row">
        <details className="dropdown">
          <summary className="btn m-1">{detailLevel}</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {DetailLevel.map((value, id) => (
              <li key={id}>
                <button type="button" onClick={() => setDetailLevel(value)}>
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

function HexbinMap() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { setHTML, setGeojson, mapData, setMapData, setGroupedMetricByCoords } =
    useHexmap();

  useEffect(() => {
    setHTML(ref.current);
  }, [ref.current]);

  useEffect(() => {
    const setLoadedMapData = (loadedMapData: tLoadedMapData) => {
      setGeojson(loadedMapData.geojson as d3MapLib.tFeatureCollection);
      setMapData(loadedMapData.hexData as unknown[]);
    };
    loadData().then(setLoadedMapData).catch(console.error);
  }, []);

  useEffect(() => {
    if (!mapData) return;
    const groupedByCoords = dataProcessor.groupByCoords(mapData as tCSVEntry[]);
    setGroupedMetricByCoords(groupedByCoords);
  }, [mapData]);

  return (
    <div>
      <span>Hexbin Map</span>
      <Controls />
      <div className="flex">
        <div className="h-[400px] w-[800px]" ref={ref} />
      </div>
    </div>
  );
}

export { HexbinMap };
