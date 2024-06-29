import dayjs, { Dayjs } from 'dayjs';
import * as np from '../NumpyClone/numpy';

// interface DailyAverage {
//     date: Date;
//     average: number;
//   }

//   function calculateDailyAverages(
//     dates: Date[],
//     values: number[]
//   ): DailyAverage[] {
//     const dailyData: {
//       [key: string]: { sum: number; count: number; date: Date };
//     } = {};

//     // Group the values by day and accumulate the sum and count
//     dates.forEach((date, index) => {
//       const day = date.toISOString().split('T')[0]; // Get the YYYY-MM-DD part of the date string
//       if (!dailyData[day]) {
//         dailyData[day] = { sum: 0, count: 0, date: new Date(day) };
//       }
//       dailyData[day].sum += values[index];
//       dailyData[day].count += 1;
//     });

//     // Calculate the average for each day
//     const dailyAverages: DailyAverage[] = Object.values(dailyData).map(
//       (data) => ({
//         date: data.date,
//         average: data.sum / data.count,
//       })
//     );

//     return dailyAverages;
//   }

//   function generateHourlyDates(startDate: Date, endDate: Date): Date[] {
//     const dates: Date[] = [];
//     const currentDate = new Date(startDate);

//     while (currentDate <= endDate) {
//       dates.push(new Date(currentDate));
//       currentDate.setHours(currentDate.getHours(), 0, 0, 0); // Reset minutes, seconds, and milliseconds
//       currentDate.setHours(currentDate.getHours() + 1);
//     }

//     return dates;
//   }

//   function generateHourlyData(dates: Date[]) {
//     const x = 1;
//     const y = 5;

//     const gridEnergy = dates.map(() => Math.random() * (y - x));
//     const pvEnergy = dates.map(() => Math.random() * (y - x));
//     const cost = dates.map(() => Math.random() * (y - x));

//     return {
//       gridEnergy,
//       pvEnergy,
//       cost,
//     };
//   }

// const xs = getDates('2020-01-01', '2020-12-31');
// const ys = NumpyClone.noise(0, 0.5, xs.length);
// const ys2 = NumpyClone.noise(0.5, 0.6, xs.length);

type tTestData = {
  x1: number;
  x2: number;
  x3: number;
};

class DataGenerator {
  length: number;
  min: number;
  max: number;
  testData: tTestData[];

  constructor(length: number, min: number, max: number) {
    this.length = length;
    this.min = min;
    this.max = max;
    this.testData = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
      this.testData.push({
        x1: Math.random() * (max - min),
        x2: Math.random() * (max - min),
        x3: Math.random() * (max - min),
      });
    }
  }
}

class DateGenerator {
  startDate: Dayjs;
  stopDate: Dayjs;
  dateArray: Date[];
  minDate: string;
  maxDate: string;

  constructor(startDate: string, endDate: string, format = 'YYYY-MM-DD') {
    this.startDate = dayjs(startDate);
    this.stopDate = dayjs(endDate);

    let currDate = dayjs(startDate);
    this.dateArray = [];

    while (currDate <= this.stopDate) {
      const momentDate = dayjs(currDate).format(format);
      const jsDate = new Date(momentDate);
      this.dateArray.push(jsDate);
      currDate = dayjs(currDate).add(1, 'hours');
    }

    this.minDate = '';
    this.maxDate = '';
  }

  //   generateHours() {}

  //   generateWeeks() {}

  //   generateMonths() {}

  //   generateYears() {}
}

export { DataGenerator, DateGenerator };
