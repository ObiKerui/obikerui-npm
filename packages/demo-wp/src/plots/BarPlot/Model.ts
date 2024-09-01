type tData = {
  date: string;
  consumption: number;
  export: number;
  ppkwh: number;
};

type tMonths = Map<string, tData[]>;

const TimePeriods = ['months', 'weeks', 'days', 'hours'] as const;
type tPeriod = (typeof TimePeriods)[number];

const Metric = ['Avg Consumption', 'Avg Export', 'Avg Price Per KwH'] as const;
type tMetric = (typeof Metric)[number];

type tModel = {
  chartRef: HTMLDivElement | null;
  dataSeries: tData[];
  sorting: tPeriod;
  groupedData: tData[];
  metric: tMetric;
};

export { Metric, TimePeriods };
export type { tData, tModel, tMetric, tPeriod };
