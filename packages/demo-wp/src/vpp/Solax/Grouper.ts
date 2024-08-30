import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import * as d3 from 'd3-array';
import { tSolaxData, tPowerCategory, tPercentages, tProfitLoss } from './Types';

dayjs.extend(isBetween);

type tPowerCategoryObj = {
  [Key in tPowerCategory]: number;
};

// type tMapped<T extends object> = {
//   [Key in keyof T as Key extends string ? Key : never]?: number;
// };

type tAveraged = {
  key: string;
} & tPowerCategoryObj;

type tGroupedData = {
  labels: string[];
  colours: string[];
  categories: string[];
  minMax: [number, number];
  data: tAveraged[];
};

type tAverageData = {
  key: string;
  value: number;
};

type tMonths = Map<string, tSolaxData[]>;

const periods = ['months', 'weeks', 'days', 'hours'] as const;
type tPeriod = (typeof periods)[number];

function sortToMonths(data: tSolaxData[]): Map<string, tSolaxData[]> {
  const groupedData = new Map<string, tSolaxData[]>();

  // Group data by month using dayjs
  data.forEach((entry) => {
    const month = dayjs(entry.uploadTime).format('YYYY-MM');

    if (!groupedData.get(month)) {
      groupedData.set(month, []);
    }
    const arr = groupedData.get(month);
    if (arr) {
      arr.push(entry);
      groupedData.set(month, arr);
    }
  });

  const groupedAnother = d3.group(data, (entry) => {
    const month = dayjs(entry.uploadTime).format('YYYY-MM');
    return month;
  });

  const result = d3.rollup(
    data,
    (entries) => {
      const totalEntries = entries.length;
      const totalConsumption = entries.reduce(
        (sum, entry) => sum + entry.consumeenergy,
        0
      );
      const totalYield = entries.reduce(
        (sum, entry) => sum + entry.yieldtoday,
        0
      );
      const totalSoc = entries.reduce((sum, entry) => sum + entry.soc, 0);
      const totalFeedInEnergy = entries.reduce(
        (sum, entry) => sum + entry.feedinenergy,
        0
      );
      return {
        consumption: totalConsumption / totalEntries,
        dailyYield: totalYield / totalEntries,
        soc: totalSoc / totalEntries,
        feedInEnergy: totalFeedInEnergy / totalEntries,
      } as tPowerCategoryObj;
    },
    (entry) => dayjs(entry.uploadTime).format('YYYY-MM')
  );
  return groupedData;
}

function sortToWeeks(data: tSolaxData[]): Map<string, tSolaxData[]> {
  const groupedData = new Map<string, tSolaxData[]>();

  // Group data by month using dayjs
  data.forEach((entry) => {
    const weekStart = dayjs(entry.uploadTime)
      .startOf('week')
      .format('YYYY-MM-DD');

    if (!groupedData.get(weekStart)) {
      groupedData.set(weekStart, []);
    }
    const arr = groupedData.get(weekStart);
    if (arr) {
      arr.push(entry);
      groupedData.set(weekStart, arr);
    }
  });
  return groupedData;
}

function sortToDays(data: tSolaxData[]): Map<string, tSolaxData[]> {
  const groupedData = new Map<string, tSolaxData[]>();

  // Group data by month using dayjs
  data.forEach((entry) => {
    const day = dayjs(entry.uploadTime).format('YYYY-MM-DD');

    if (!groupedData.get(day)) {
      groupedData.set(day, []);
    }
    const arr = groupedData.get(day);
    if (arr) {
      arr.push(entry);
      groupedData.set(day, arr);
    }
  });
  return groupedData;
}

function sortToHours(data: tSolaxData[]): Map<string, tSolaxData[]> {
  const groupedData = new Map<string, tSolaxData[]>();

  // Group data by month using dayjs
  data.forEach((entry) => {
    const hour = dayjs(entry.uploadTime).format('YYYY-MM-DD HH');

    if (!groupedData.get(hour)) {
      groupedData.set(hour, []);
    }
    const arr = groupedData.get(hour);
    if (arr) {
      arr.push(entry);
      groupedData.set(hour, arr);
    }
  });
  return groupedData;
}

function averageData(data: tMonths) {
  const result = Array.from(data).map(([key, entries]) => {
    const totalEntries = entries.length;
    const totalConsumption = entries.reduce(
      (sum, entry) => sum + entry.consumeenergy,
      0
    );
    const totalFeedInEnergy = entries.reduce(
      (sum, entry) => sum + entry.feedinenergy,
      0
    );
    const totalSoc = entries.reduce((sum, entry) => sum + entry.soc, 0);
    const totalYield = entries.reduce(
      (sum, entry) => sum + entry.yieldtoday,
      0
    );

    return {
      key,
      consumption: totalConsumption / totalEntries,
      dailyYield: totalYield / totalEntries,
      feedInEnergy: totalFeedInEnergy / totalEntries,
      soc: totalSoc / totalEntries,
    } as tAveraged;
  });

  return result;
}

class DataGrouper {
  getNewest(data: tSolaxData[]) {
    const len = data.length;
    return len > 0 ? data[len - 1] : null;
  }

  getRange(data: tSolaxData[], range: [dayjs.Dayjs, dayjs.Dayjs]) {
    return data.filter((elem) =>
      dayjs(elem.uploadTime).isBetween(range[0], range[1])
    );
  }

  getProfitLoss(data: tSolaxData[]) {
    let totalFeedIn = 0;
    let totalConsumed = 0;

    data.forEach((elem) => {
      const amount = elem.feedinenergy;
      if (amount >= 0) totalFeedIn += amount;
      if (amount < 0) totalConsumed += amount;
    });

    return {
      consumed: totalConsumed * -1,
      feedin: totalFeedIn,
    } as tProfitLoss;
  }

  getPercentages(data: tSolaxData[]) {
    let full = 0;
    let empty = 0;
    let charging = 0;
    let discharging = 0;
    const num = data.length;

    data.forEach((elem, ith) => {
      const batValue = elem.soc;
      const prevBatValue = ith > 0 ? data[ith - 1].soc : null;
      if (batValue >= 90) {
        full += 1;
        return;
      }
      if (batValue < 10) {
        empty += 1;
        return;
      }
      if (prevBatValue && batValue > prevBatValue) {
        charging += 1;
        return;
      }
      if (prevBatValue && batValue < prevBatValue) discharging += 1;
    });

    return {
      full: full / num,
      empty: empty / num,
      charging: charging / num,
      discharging: discharging / num,
    } as tPercentages;
  }

  groupByMonths(data: tSolaxData[]) {
    const monthlyData = sortToMonths(data);

    // console.log('json data / monthly ', data, monthlyData);

    const averaged = averageData(monthlyData);
    return {
      labels: Array.from(monthlyData.keys()),
      colours: ['blue', 'red'],
      categories: [],
      minMax: [0, 0],
      data: averaged,
    } as tGroupedData;
  }

  groupByWeeks(data: tSolaxData[]) {
    const weeklyData = sortToWeeks(data);

    const entriesArray = Array.from(weeklyData.entries());
    const lastFourEntries = entriesArray.slice(-16);
    const truncated = new Map(lastFourEntries);

    // console.log('json data / weekly ', data, weeklyData);

    const averaged = averageData(truncated);
    return {
      labels: Array.from(truncated.keys()),
      colours: ['blue', 'red'],
      categories: ['avgConsumption', 'avgExport'],
      minMax: [0, 0],
      data: averaged,
    } as tGroupedData;
  }

  groupByDays(data: tSolaxData[]) {
    const dailyData = sortToDays(data);

    const entriesArray = Array.from(dailyData.entries());
    const lastFourEntries = entriesArray.slice(-14);
    const truncated = new Map(lastFourEntries);

    // console.log('json data / weekly ', data, dailyData);

    const averaged = averageData(truncated);
    return {
      labels: Array.from(truncated.keys()),
      colours: ['blue', 'red'],
      categories: ['avgConsumption', 'avgExport'],
      minMax: [0, 0],
      data: averaged,
    } as tGroupedData;
  }

  groupByHours(data: tSolaxData[]) {
    const hourlyData = sortToHours(data);

    const entriesArray = Array.from(hourlyData.entries());
    const lastFourEntries = entriesArray.slice(-24);
    const truncated = new Map(lastFourEntries);

    // console.log('json data / weekly ', data, hourlyData);

    const averaged = averageData(truncated);
    return {
      labels: Array.from(truncated.keys()),
      colours: ['blue', 'red'],
      categories: ['avgConsumption', 'avgExport'],
      minMax: [0, 0],
      data: averaged,
    } as tGroupedData;
  }
}

// class LineData {
//   averaged(groupedData: tGroupedData) {
//     const { data } = groupedData;
//     const transformed = data.map((elem) => {
//       const value =
//         (elem.avgConsumption + elem.avgExport + elem.avgPPKWH) / 3.0;
//       return {
//         key: elem.key,
//         value: value + Math.random() * 4,
//       };
//     });
//     return transformed;
//   }
// }

export type { tPeriod, tAverageData, tGroupedData };
export { DataGrouper };
