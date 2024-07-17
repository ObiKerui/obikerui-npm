import * as d3 from 'd3-array';
import * as d3MapLib from '@obikerui/d3-map-lib';

type tCSVEntry = {
  county: string;
  id: string;
  marketName: string;
  website: string;
  city: string;
  lat: number;
  lng: number;
  state: string;
};

class DataProcessor {
  groupByStates(marketsCSV: tCSVEntry[]) {
    const grouped = d3.rollup(
      marketsCSV,
      (entries) => ({
        coords: [entries[0].lng, entries[0].lat],
        data: entries,
      }),
      (entry) => entry.state
    );

    return new Map<string, unknown>(grouped);
  }

  groupByCoords(marketsCSV: tCSVEntry[]) {
    const arr = marketsCSV.map(
      (elem) =>
        ({
          coords: [+elem.lng, +elem.lat],
          data: elem,
        } as d3MapLib.tMapFeature)
    );
    return arr;
  }
}

export type { tCSVEntry };
export { DataProcessor };
