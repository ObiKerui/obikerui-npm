const SpeciesKey = ['setosa', 'versicolor', 'virginica'] as const;
type tSpeciesKey = (typeof SpeciesKey)[number];

const SpeciesLabel = ['Setosa', 'Versicolor', 'Virginica'] as const;
type tSpeciesLabel = (typeof SpeciesLabel)[number];

type tCSVElement = {
  petalLength: number;
  petalWidth: number;
  sepalLength: number;
  sepalWidth: number;
  species: tSpeciesKey;
};

type tData = {
  date: string;
  consumption: number;
  export: number;
  ppkwh: number;
};

type tAveraged = {
  key: string;
  avgConsumption: number;
  avgExport: number;
  avgPPKWH: number;
};

type tSpeciesParams = {
  label: string;
  active: boolean;
};

type tSpeciesFilter = Map<tSpeciesKey, tSpeciesParams>;

const Metric = [
  'Sepal Length',
  'Sepal Width',
  'Petal Length',
  'Petal Width',
] as const;

type tMetric = (typeof Metric)[number];
type tMetricParams = {
  label: string;
  active: boolean;
};
type tMetricFilter = Map<tMetric, tMetricParams>;

type tGroupedData = {
  data: Map<tMetric, number[]>;
};

type tChartData = {
  chartRef: HTMLDivElement | null;
  dataSeries: tCSVElement[];
  columns: string[];
  colours: string[];
  species: tSpeciesFilter;
  groupedData: tGroupedData | null;
  metric: tMetricFilter;
};

class DataGrouper {
  filterBySpecies(dataSeries: tCSVElement[], species: tSpeciesFilter) {
    const filtered = dataSeries.filter((elem) => {
      const speciesValue = elem.species;
      const status = species.get(speciesValue)?.active ?? false;
      return status;
    });
    return filtered;
  }

  groupByMetric(dataSeries: tCSVElement[]) {
    const map = new Map<tMetric, number[]>();

    map.set('Petal Length', []);
    map.set('Petal Width', []);
    map.set('Sepal Length', []);
    map.set('Sepal Width', []);

    dataSeries.forEach((elem) => {
      const petalLengthArr = map.get('Petal Length') ?? [];
      petalLengthArr.push(elem.petalLength);

      const petalWidthArr = map.get('Petal Width') ?? [];
      petalWidthArr.push(elem.petalWidth);

      const sepalLengthArr = map.get('Sepal Length') ?? [];
      sepalLengthArr.push(elem.sepalLength);

      const sepalWidthArr = map.get('Sepal Width') ?? [];
      sepalWidthArr.push(elem.sepalWidth);
    });
    return map;
  }
}

export type {
  tData,
  tGroupedData,
  tChartData,
  tAveraged,
  tMetric,
  tCSVElement,
  tSpeciesFilter,
  tMetricFilter,
  tSpeciesKey,
  tSpeciesParams,
  tSpeciesLabel,
  tMetricParams,
};
export { DataGrouper, Metric, SpeciesLabel, SpeciesKey };
