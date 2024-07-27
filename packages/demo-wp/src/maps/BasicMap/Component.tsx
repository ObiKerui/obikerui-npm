/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { useDensityMap, Projections } from './Map';
import { cn } from '../../Utils/CSS';

type tLoadedMapData = {
  states: unknown;
  counties: unknown;
};

async function loadData() {
  // create the states geojson
  const statesGeojson: any = await d3.json('assets/us-states.geojson');

  // filter out Alaska, Hawaii and Puerto Rico to fit on Canvas
  // const filteredFeaturesArr = featuresArr.filter((elem: any) => {
  //   const { name } = elem.properties;
  //   return name !== 'Alaska' && name !== 'Hawaii' && name !== 'Puerto Rico';
  // }) as unknown[];

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
      const { id } = unemploymentInCounty;
      const { rate } = unemploymentInCounty;

      if (id === countyGeoID) {
        county.properties.rate = +(rate ?? 0);
        break;
      }
    }
  }

  return {
    states: statesGeojson,
    counties: countiesGeojsonCopy,
  };
}

function Controls() {
  const {
    zoom,
    setZoom,
    translate,
    setTranslate,
    projection,
    setProjection,
    reposition,
    setReposition,
  } = useDensityMap();

  const setZoomFtn = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    console.log(changeEvent.target.value);
    setZoom(+changeEvent.target.value);
  };

  const setXPosition = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    console.log(changeEvent.target.value);
    setTranslate([+changeEvent.target.value, translate[1]]);
  };

  const setYPosition = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    console.log(changeEvent.target.value);
    setTranslate([translate[0], +changeEvent.target.value]);
  };

  const setProjectionFtn = (proj: string) => {
    setProjection(proj as keyof typeof Projections);
  };

  return (
    <div>
      <div className="flex flex-row">
        <details className="dropdown">
          <summary className="btn m-1">{projection as string}</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {Projections.map((proj, id) => (
              <li key={id}>
                <button type="button" onClick={() => setProjectionFtn(proj)}>
                  {proj}
                </button>
              </li>
            ))}
          </ul>
        </details>

        <div>
          <button
            type="button"
            className={cn('btn', {
              'btn-active': reposition,
            })}
            onClick={() => setReposition(!reposition)}
          >
            Reposition Map
          </button>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max="450"
        value={zoom}
        className="range"
        onChange={setZoomFtn}
      />
      <input
        type="range"
        min={0}
        max="1000"
        value={translate[0]}
        className="range"
        onChange={setXPosition}
      />
      <input
        type="range"
        min={0}
        max="600"
        value={translate[1]}
        className="range"
        onChange={setYPosition}
      />
    </div>
  );
}

function MapState() {
  const { zoom, translate } = useDensityMap();

  return (
    <div>
      <span>
        scale: <pre>{JSON.stringify(zoom)}</pre>
      </span>
      <span>
        transform: <pre>{JSON.stringify(translate)}</pre>
      </span>
    </div>
  );
}

function BasicMap() {
  const ref = useRef<HTMLDivElement | null>(null);

  const { setHTML, setStatesGeojson } = useDensityMap();

  useEffect(() => {
    setHTML(ref.current);
  }, [ref.current]);

  useEffect(() => {
    const setLoadedMapData = (loadedMapData: tLoadedMapData) => {
      setStatesGeojson(loadedMapData.states);
    };
    loadData().then(setLoadedMapData).catch(console.error);
  }, []);

  return (
    <div>
      <span>Basic Map</span>
      <Controls />
      <MapState />
      <div className="flex">
        <div className="h-[400px] w-[800px]" ref={ref} />
      </div>
    </div>
  );
}

export { BasicMap };
