import dayjs from 'dayjs';
import * as d3Array from 'd3-array';
import { tPeriod } from './Model';

const groupToHour = (date: string) => dayjs(date).format('YYYY-MM-DD HH');
const groupToDay = (date: string) => dayjs(date).format('YYYY-MM-DD');
const groupToWeek = (date: string) =>
  dayjs(date).startOf('week').format('YYYY-MM-DD');
const groupToMonth = (date: string) => dayjs(date).format('YYYY-MM');

const timeMap = new Map<tPeriod, (date: string) => string>([
  ['hours', groupToHour],
  ['days', groupToDay],
  ['weeks', groupToWeek],
  ['months', groupToMonth],
]);

type tDateObject = {
  date: string;
};

type tAggResults = Partial<Record<string, number>>;

function computeAgg<T extends Record<string, unknown>>(
  date: string,
  entries: T[],
  compute: (arr: T[], accessor: (arg: T) => number) => number | undefined
): { date: string } & tAggResults {
  const aggs: tAggResults = {};

  if (entries.length === 0)
    return { date, ...aggs } as { date: string } & tAggResults;

  // Get the keys from the first entry
  const fields = Object.keys(entries[0]) as Array<keyof T>;

  fields.forEach((field) => {
    const value = entries[0][field];
    if (typeof value === 'number') {
      aggs[field as string] = compute(entries, (e) => e[field] as number) ?? 0;
    }
  });

  return { date, ...aggs } as { date: string } & tAggResults;
}

class DayjsGrouper<T extends tDateObject> {
  data: T[];
  mappedData: Map<string, T[]>;
  constructor() {
    this.data = [];
    this.mappedData = new Map<string, T[]>();
  }

  setData(d: T[]) {
    this.data = d;
    return this;
  }

  getData(): T[] {
    return this.data;
  }

  truncate(start: dayjs.Dayjs, end: dayjs.Dayjs) {
    const truncated = this.data.filter((elem) => {
      const elemDate = dayjs(elem.date);
      return elemDate.isAfter(start, 'hour') && elemDate.isBefore(end, 'hour');
    });
    this.data = truncated;
    return this;
  }

  group(option: tPeriod) {
    const groupFtn = timeMap.get(option) ?? groupToMonth;

    const grouped = d3Array.group(this.data, (entry) => {
      const period = groupFtn(entry.date);
      return period;
    });
    const groupMap = new Map(grouped);
    this.mappedData = groupMap;
    return this;
  }

  average() {
    const result = Array.from(this.mappedData).map(([date, entries]) =>
      computeAgg(date, entries, d3Array.mean)
    );
    this.data = result as unknown as T[];
    return this;
  }

  median() {
    const result = Array.from(this.mappedData).map(([date, entries]) =>
      computeAgg(date, entries, d3Array.median)
    );
    this.data = result as unknown as T[];
    return this;
  }
}

// class DateGrouper {
//   group(option: tPeriod, data: tData[]) {
//     const groupFtn = timeMap.get(option) ?? groupToMonth;

//     const grouped = d3Array.group(data, (entry) => {
//       const period = groupFtn(entry.date);
//       return period;
//     });
//     const groupMap = new Map(grouped);
//     return this.average(groupMap);
//   }

//   truncate(data: tData[], start: dayjs.Dayjs, end: dayjs.Dayjs) {
//     const truncated = data.filter((elem) => {
//       const elemDate = dayjs(elem.date);
//       return elemDate.isAfter(start, 'hour') && elemDate.isBefore(end, 'hour');
//     });
//     return truncated;
//   }

//   average(mappedData: Map<string, tData[]>) {
//     const result = Array.from(mappedData).map(
//       ([date, entries]) =>
//         ({
//           date,
//           consumption: d3Array.mean(entries, (e) => e.consumption),
//           export: d3Array.mean(entries, (e) => e.export),
//           ppkwh: d3Array.mean(entries, (e) => e.ppkwh),
//         } as tData)
//     );
//     return result;
//   }

//   median(mappedData: Map<string, tData[]>) {
//     const result = Array.from(mappedData).map(
//       ([date, entries]) =>
//         ({
//           date,
//           consumption: d3Array.median(entries, (e) => e.consumption),
//           export: d3Array.median(entries, (e) => e.export),
//           ppkwh: d3Array.median(entries, (e) => e.ppkwh),
//         } as tData)
//     );
//     return result;
//   }
// }

export { DayjsGrouper };
