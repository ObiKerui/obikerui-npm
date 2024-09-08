type tMapValue = {
  label: string;
  active: boolean;
};

const SpeciesKey = ['setosa', 'versicolor', 'virginica'] as const;
type tSpeciesKey = (typeof SpeciesKey)[number];

const SpeciesMap = new Map<tSpeciesKey, tMapValue>([
  ['setosa', { label: 'Setosa', active: true }],
  ['versicolor', { label: 'Versicolor', active: true }],
  ['virginica', { label: 'Virginica', active: true }],
]);

const MetricKey = [
  'petalLength',
  'petalWidth',
  'sepalLength',
  'sepalWidth',
] as const;
type tMetricKey = (typeof MetricKey)[number];

const MetricMap = new Map<tMetricKey, tMapValue>([
  [
    'petalLength',
    {
      label: 'Petal Length',
      active: true,
    },
  ],
  [
    'petalWidth',
    {
      label: 'Petal Width',
      active: true,
    },
  ],
  [
    'sepalLength',
    {
      label: 'Sepal Length',
      active: true,
    },
  ],
  [
    'sepalWidth',
    {
      label: 'Sepal Width',
      active: true,
    },
  ],
]);

type tCSVElement = {
  [K in tMetricKey]: number;
} & {
  species: tSpeciesKey;
};

type tModel = {
  chartRef: HTMLDivElement | null;
  dataSeries: tCSVElement[];
  processedData: tCSVElement[];
  colours: string[];
  species: typeof SpeciesMap;
  metric: typeof MetricMap;
};

export { SpeciesMap, MetricMap };
export type { tCSVElement, tSpeciesKey, tModel, tMetricKey };
