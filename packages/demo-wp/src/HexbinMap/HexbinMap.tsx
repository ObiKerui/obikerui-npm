/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLayoutEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as d3MapLib from 'd3-map-lib';

declare const topojson: any;

async function createHexbinMap(ref: any) {
  const json: any = await d3.json('assets/USA.json');
  const geojson = topojson.feature(json, json.objects.us);

  let datapoints = (await d3.json('assets/markets_overall.json')) as any;
  if (!datapoints) {
    datapoints = [];
  }
  datapoints = datapoints.map((el: any) => {
    const copy = { ...el };
    copy.long = el.lng;
    return copy;
  });

  // extract mainland USA
  const geojsonCopy = JSON.parse(JSON.stringify(geojson));
  const mainlandCoords = geojson.features[0].geometry.coordinates[7][0];
  geojsonCopy.features[0].geometry.coordinates = [[mainlandCoords]];

  //   const projector = d3MapLib.Projection().projection(d3.geoAlbers());

  const hexes = (d3MapLib.Hexbin() as any).geojson(geojsonCopy).datapoints(datapoints);

  const regions = (d3MapLib.MapLayer() as any).geojson(geojsonCopy);

  const container = (d3MapLib.Container() as any)
    .margin({ left: 10, right: 10, top: 10, bottom: 10 })
    // .projector(projector)
    .plot(regions)
    .plot(hexes);

  d3.select(ref).call(container);
  return container;
}

export default function () {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const generateMap = async () => {
      const currRef = ref.current;
      await createHexbinMap(currRef);
    };
    generateMap();
  }, []);

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="hexbin-map">Hexbin Map</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Hexbin map is for rendering such n such. Good for which types of visual, bad for these
            others..etc.
          </p>
        </div>
      </div>
    </div>
  );
}
