import dayjs from 'dayjs';
import * as d3 from 'd3-array';
import { tData, tPeriod } from './Model';

const groupToHour = (date: string) => dayjs(date).format('YYYY-MM-DD HH');

const groupToDay = (date: string) => dayjs(date).format('YYYY-MM-DD');

const groupToWeek = (date: string) =>
  dayjs(date).startOf('week').format('YYYY-MM-DD');

const groupToMonth = (date: string) => dayjs(date).format('YYYY-MM');
// const groupToQuarter = (date: string) => dayjs(date).format('YYYY-MM');
// const groupToYear = (date: string) => dayjs(date).format('YYYY');

const timeMap = new Map<tPeriod, (date: string) => string>([
  ['hours', groupToHour],
  ['days', groupToDay],
  ['weeks', groupToWeek],
  ['months', groupToMonth],
]);

class DateGrouper {
  group(option: tPeriod, data: tData[]) {
    const groupFtn = timeMap.get(option) ?? groupToMonth;

    const grouped = d3.group(data, (entry) => {
      const period = groupFtn(entry.date);
      return period;
    });
    const groupMap = new Map(grouped);
    return this.average(groupMap);
  }

  average(mappedData: Map<string, tData[]>) {
    const result = Array.from(mappedData).map(
      ([date, entries]) =>
        ({
          date,
          consumption: d3.mean(entries, (e) => e.consumption),
          export: d3.mean(entries, (e) => e.export),
          ppkwh: d3.mean(entries, (e) => e.ppkwh),
        } as tData)
    );
    return result;
  }

  median(mappedData: Map<string, tData[]>) {
    const result = Array.from(mappedData).map(
      ([date, entries]) =>
        ({
          date,
          consumption: d3.median(entries, (e) => e.consumption),
          export: d3.median(entries, (e) => e.export),
          ppkwh: d3.median(entries, (e) => e.ppkwh),
        } as tData)
    );
    return result;
  }
}

export { DateGrouper };
