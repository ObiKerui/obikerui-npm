import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import * as d3 from 'd3-array';
import { create } from 'zustand';

dayjs.extend(isBetween);

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

type tGroupedData = {
  labels?: string[];
  colours?: string[];
  categories?: string[];
  minMax?: [number, number];
  data: tAveraged[];
};

type tAverageData = {
  key: string;
  value: number;
};

type tMonths = Map<string, tData[]>;

const periods = ['JanMar', 'AprJune', 'JulSept', 'OctDec'] as const;
type tPeriod = (typeof periods)[number];

type tChartData = {
  overviewRef: HTMLDivElement | null;
  setOverviewRef: (newRef: HTMLDivElement | null) => void;
  detailRef: HTMLDivElement | null;
  setDetailRef: (newRef: HTMLDivElement | null) => void;
  dataSeries: tData[];
  setDataSeries: (newSeries: tData[]) => void;
  quarter: tPeriod;
  setQuarter: (newQuarter: tPeriod) => void;
  groupedData: tGroupedData | null;
  setGroupedData: (newData: tGroupedData) => void;
  averageData: tAverageData[];
  setAverageData: (newData: tAverageData[]) => void;
  detailDomain: [Date, Date];
  setDetailDomain: (newData: [Date, Date]) => void;
};

const useChartData = create<tChartData>((set) => ({
  overviewRef: null,
  setOverviewRef: (newRef) => set({ overviewRef: newRef }),
  detailRef: null,
  setDetailRef: (newRef) => set({ detailRef: newRef }),
  dataSeries: [],
  setDataSeries: (newSeries) => set({ dataSeries: newSeries }),
  quarter: 'JanMar',
  setQuarter: (newQuarter) => set({ quarter: newQuarter }),
  groupedData: null,
  setGroupedData: (newData) => set({ groupedData: newData }),
  averageData: [],
  setAverageData: (newData) => set({ averageData: newData }),
  detailDomain: [new Date('2023-01-01'), new Date('2023-01-15')],
  setDetailDomain: (newData) => set({ detailDomain: newData }),
}));

function filterToPeriod(data: tData[], start: Date, end: Date) {
  const inPeriod = data.filter((elem) =>
    dayjs(elem.date).isBetween(start, end, null, '[]')
  );
  return inPeriod;
}

function groupToPeriod(data: tData[], period: string) {
  const groupedData = new Map<string, tData[]>();

  // Group data by month using dayjs
  data.forEach((entry) => {
    const elem = dayjs(entry.date).format(period);

    if (!groupedData.get(elem)) {
      groupedData.set(elem, []);
    }
    const arr = groupedData.get(elem);
    if (arr) {
      arr.push(entry);
      groupedData.set(elem, arr);
    }
  });
  return groupedData;
}

function averageData(data: tMonths) {
  const result = Array.from(data).map(([key, entries]) => {
    const totalEntries = entries.length;
    const totalConsumption = entries.reduce(
      (sum, entry) => sum + entry.consumption,
      0
    );
    const totalExport = entries.reduce((sum, entry) => sum + entry.export, 0);
    const totalPpkwh = entries.reduce((sum, entry) => sum + entry.ppkwh, 0);

    return {
      key,
      avgConsumption: totalConsumption / totalEntries,
      avgExport: totalExport / totalEntries,
      avgPPKWH: totalPpkwh / totalEntries,
    } as tAveraged;
  });

  return result;
}

class DataGrouper {
  groupByJanMarch(data: tData[]) {
    const start = dayjs('2023-01-01');
    const end = dayjs('2023-03-31');

    const quarter = filterToPeriod(data, start.toDate(), end.toDate());
    const grouped = groupToPeriod(quarter, 'YYYY-MM-DD');
    const averaged = averageData(grouped);

    return {
      data: averaged,
    } as tGroupedData;
  }

  groupByAprJune(data: tData[]) {
    const start = dayjs('2023-04-01');
    const end = dayjs('2023-06-31');

    const quarter = filterToPeriod(data, start.toDate(), end.toDate());
    const grouped = groupToPeriod(quarter, 'YYYY-MM-DD');
    const averaged = averageData(grouped);

    return {
      data: averaged,
    } as tGroupedData;
  }

  groupByJulSept(data: tData[]) {
    const start = dayjs('2023-07-01');
    const end = dayjs('2023-09-31');

    const quarter = filterToPeriod(data, start.toDate(), end.toDate());
    const grouped = groupToPeriod(quarter, 'YYYY-MM-DD');
    const averaged = averageData(grouped);

    return {
      data: averaged,
    } as tGroupedData;
  }

  groupByOctDec(data: tData[]) {
    const start = dayjs('2023-10-01');
    const end = dayjs('2023-12-31');

    const quarter = filterToPeriod(data, start.toDate(), end.toDate());
    const grouped = groupToPeriod(quarter, 'YYYY-MM-DD');
    const averaged = averageData(grouped);

    return {
      data: averaged,
    } as tGroupedData;
  }
}

class LineData {
  averaged(groupedData: tGroupedData) {
    const { data } = groupedData;
    const transformed = data.map((elem) => {
      const value =
        (elem.avgConsumption + elem.avgExport + elem.avgPPKWH) / 3.0;
      return {
        key: elem.key,
        value: value + Math.random() * 4,
      };
    });
    return transformed;
  }
}

export type { tData, tPeriod, tChartData, tAverageData, tAveraged };
export { DataGrouper, LineData, useChartData };
