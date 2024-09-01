import dayjs from 'dayjs';
import * as d3Array from 'd3-array';
import { tData, tPeriod } from './Model';

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

class DateGrouper {
  group(option: tPeriod, data: tData[]) {
    const groupFtn = timeMap.get(option) ?? groupToMonth;

    const grouped = d3Array.group(data, (entry) => {
      const period = groupFtn(entry.date);
      return period;
    });
    const groupMap = new Map(grouped);
    return this.average(groupMap);
  }

  truncate(data: tData[], start: dayjs.Dayjs, end: dayjs.Dayjs) {
    const truncated = data.filter((elem) => {
      const elemDate = dayjs(elem.date);
      return elemDate.isAfter(start, 'hour') && elemDate.isBefore(end, 'hour');
    });
    return truncated;
  }

  average(mappedData: Map<string, tData[]>) {
    const result = Array.from(mappedData).map(
      ([date, entries]) =>
        ({
          date,
          consumption: d3Array.mean(entries, (e) => e.consumption),
          export: d3Array.mean(entries, (e) => e.export),
          ppkwh: d3Array.mean(entries, (e) => e.ppkwh),
        } as tData)
    );
    return result;
  }

  median(mappedData: Map<string, tData[]>) {
    const result = Array.from(mappedData).map(
      ([date, entries]) =>
        ({
          date,
          consumption: d3Array.median(entries, (e) => e.consumption),
          export: d3Array.median(entries, (e) => e.export),
          ppkwh: d3Array.median(entries, (e) => e.ppkwh),
        } as tData)
    );
    return result;
  }
}

export { DateGrouper };
