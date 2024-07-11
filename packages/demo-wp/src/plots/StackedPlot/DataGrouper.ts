import dayjs from 'dayjs';
import * as d3 from 'd3-array';

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

type tMonths = Map<string, tData[]>;

function sortToMonths(data: tData[]): Map<string, tData[]> {
  const groupedData = new Map<string, tData[]>();

  // Group data by month using dayjs
  data.forEach((entry) => {
    const month = dayjs(entry.date).format('YYYY-MM');

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
    const month = dayjs(entry.date).format('YYYY-MM');
    return month;
  });

  const result = d3.rollup(
    data,
    (entries) => {
      const totalEntries = entries.length;
      const totalConsumption = entries.reduce(
        (sum, entry) => sum + entry.consumption,
        0
      );
      const totalExport = entries.reduce((sum, entry) => sum + entry.export, 0);
      const totalPpkwh = entries.reduce((sum, entry) => sum + entry.ppkwh, 0);
      return {
        avgConsumption: totalConsumption / totalEntries,
        avgExport: totalExport / totalEntries,
        avgPPKWH: totalPpkwh / totalEntries,
      } as tAveraged;
    },
    (entry) => dayjs(entry.date).format('YYYY-MM')
  );
  console.log('result: ', result);

  return groupedData;
}

function sortToWeeks(data: tData[]): Map<string, tData[]> {
  const groupedData = new Map<string, tData[]>();

  // Group data by month using dayjs
  data.forEach((entry) => {
    const weekStart = dayjs(entry.date).startOf('week').format('YYYY-MM-DD');

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

function sortToDays(data: tData[]): Map<string, tData[]> {
  const groupedData = new Map<string, tData[]>();

  // Group data by month using dayjs
  data.forEach((entry) => {
    const day = dayjs(entry.date).format('YYYY-MM-DD');

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

function sortToHours(data: tData[]): Map<string, tData[]> {
  const groupedData = new Map<string, tData[]>();

  // Group data by month using dayjs
  data.forEach((entry) => {
    const hour = dayjs(entry.date).format('YYYY-MM-DD HH');

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

// function sortToWeeks(data: tData[]): Map<string, tData[]> {
//   const groupedData = new Map<string, tData[]>();

//   // Group data by month using dayjs
//   data.forEach((entry) => {
//     const month = dayjs(entry.date).format('YYYY-MM');

//     if (!groupedData.get(month)) {
//       groupedData.set(month, []);
//     }
//     const arr = groupedData.get(month);
//     if (arr) {
//       arr.push(entry);
//       groupedData.set(month, arr);
//     }
//   });

//   return groupedData;
// }

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
  groupByMonths(data: tData[]) {
    const monthlyData = sortToMonths(data);

    console.log('json data / monthly ', data, monthlyData);

    const averaged = averageData(monthlyData);
    return {
      labels: Array.from(monthlyData.keys()),
      colours: ['blue', 'red'],
      categories: ['avgConsumption', 'avgExport'],
      minMax: [0, 0],
      data: averaged,
    };
  }

  groupByWeeks(data: tData[]) {
    const weeklyData = sortToWeeks(data);

    const entriesArray = Array.from(weeklyData.entries());
    const lastFourEntries = entriesArray.slice(-16);
    const truncated = new Map(lastFourEntries);

    console.log('json data / weekly ', data, weeklyData);

    const averaged = averageData(truncated);
    return {
      labels: Array.from(truncated.keys()),
      colours: ['blue', 'red'],
      categories: ['avgConsumption', 'avgExport'],
      minMax: [0, 0],
      data: averaged,
    };
  }

  groupByDays(data: tData[]) {
    const dailyData = sortToDays(data);

    const entriesArray = Array.from(dailyData.entries());
    const lastFourEntries = entriesArray.slice(-14);
    const truncated = new Map(lastFourEntries);

    console.log('json data / weekly ', data, dailyData);

    const averaged = averageData(truncated);
    return {
      labels: Array.from(truncated.keys()),
      colours: ['blue', 'red'],
      categories: ['avgConsumption', 'avgExport'],
      minMax: [0, 0],
      data: averaged,
    };
  }

  groupByHours(data: tData[]) {
    const hourlyData = sortToHours(data);

    const entriesArray = Array.from(hourlyData.entries());
    const lastFourEntries = entriesArray.slice(-24);
    const truncated = new Map(lastFourEntries);

    console.log('json data / weekly ', data, hourlyData);

    const averaged = averageData(truncated);
    return {
      labels: Array.from(truncated.keys()),
      colours: ['blue', 'red'],
      categories: ['avgConsumption', 'avgExport'],
      minMax: [0, 0],
      data: averaged,
    };
  }
}

export type { tData };
export { DataGrouper };
