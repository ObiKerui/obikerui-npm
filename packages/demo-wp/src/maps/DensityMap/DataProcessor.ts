import * as d3 from 'd3-array';

type tCSVEntry = {
  county: string;
  id: string;
  rate: string;
  state: string;
};

class DataProcessor {
  groupByStates(unemploymentCSV: tCSVEntry[]) {
    const grouped = d3.rollup(
      unemploymentCSV,
      (entries) => {
        const nbrOfEntries = entries.length;
        const totalRate = entries.reduce((sum, entry) => sum + +entry.rate, 0);
        return totalRate / nbrOfEntries;
      },
      (entry) => entry.state
    );
    return new Map<string, number>(grouped);
  }

  groupByCounties(unemploymentCSV: tCSVEntry[]) {
    const map = new Map<string, number>();

    unemploymentCSV.forEach((elem) => {
      map.set(elem.id, +elem.rate);
    });

    return map;
  }
}

export type { tCSVEntry };
export { DataProcessor };
