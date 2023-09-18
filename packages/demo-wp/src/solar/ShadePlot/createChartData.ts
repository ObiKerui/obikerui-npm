/* eslint-disable no-plusplus */
import * as d3 from 'd3';
import * as SolarLib from '@obikerui/d3-solar-lib';

type tMonthData = [number[], number[]];

function generate(start: Date, end: Date, location: number[]) {
  const days = d3.utcDays(start, end, 1);
  const hours = days.flatMap((day) =>
    d3.utcHours(day, new Date(+day + 24 * 3600 * 1000), 1)
  );

  const data = hours.map((date) => ({
    date,
    hour: date.getUTCHours(),
    ...SolarLib.SunPos900(date, ...location),
  }));
  // .filter((d) => d.altitude >= -0.2);

  type tData = (typeof data)[number];
  const result: [number[], number[]] = [[], []];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < data.length; i++) {
    const elem = data[i] as tData;
    result[0].push(SolarLib.radiansToDegrees(elem.azimuth));
    result[1].push(elem.altitude);
  }
  return result;
}

function generateDaysData(date: Date, location: number[]) {
  const endDate = new Date(date);
  endDate.setDate(date.getDate() + 1);
  return generate(date, endDate, location);
}

function interpolate(xs: number[], ys: number[]) {
  const result = xs.map(
    (elem: number, ith: number) =>
      // console.log(
      //   'x, y, diff, middle: ',
      //   elem,
      //   ys[ith],
      //   Math.abs(elem - ys[ith]),
      //   Math.abs(elem - ys[ith]) / 2
      // );
      elem + Math.abs(elem - ys[ith]) / 2
  );
  return result;
}

function generateTimeOfDayData(months: unknown[], time: number) {
  const xs = [];
  const ys = [];
  for (let i = 0; i < months.length; i++) {
    const [xVals, yVals] = months[i] as number[][];
    const xVal = xVals[time];
    const yVal = yVals[time];
    xs.push(xVal);
    ys.push(yVal);
  }
  return [xs, ys];
}

function mergeTimesOfYear(timeX: tMonthData, timeY: tMonthData) {
  const xs = interpolate(timeX[0], timeY[0]);
  const ys = interpolate(timeX[1], timeY[1]);
  const xys = [xs, ys];
  return xys;
}

function split(times: number[], sp = 0) {
  let splitPoint = sp;
  if (!splitPoint) {
    splitPoint = times.length / 2.0;
  }
  return [[...times.slice(0, splitPoint)], [...times.slice(splitPoint)]];
}

export default function generateData() {
  const location = [1, 51.49];

  // generate the data for each marked period of the year
  const dec = generateDaysData(new Date(Date.UTC(1999, 11, 21)), location);
  const jan = generateDaysData(new Date(Date.UTC(2000, 0, 21)), location);
  const feb = generateDaysData(new Date(Date.UTC(2000, 1, 21)), location);
  const mar = generateDaysData(new Date(Date.UTC(2000, 2, 21)), location);
  const apr = generateDaysData(new Date(Date.UTC(2000, 3, 21)), location);
  const may = generateDaysData(new Date(Date.UTC(2000, 4, 21)), location);
  const june = generateDaysData(new Date(Date.UTC(2000, 5, 21)), location);
  const jul = generateDaysData(new Date(Date.UTC(2000, 6, 21)), location);
  const aug = generateDaysData(new Date(Date.UTC(2000, 7, 21)), location);
  const sept = generateDaysData(new Date(Date.UTC(2000, 8, 21)), location);
  const oct = generateDaysData(new Date(Date.UTC(2000, 9, 21)), location);
  const nov = generateDaysData(new Date(Date.UTC(2000, 10, 21)), location);

  // merge the locations
  const mayJuly = mergeTimesOfYear(may, jul);
  const aprAug = mergeTimesOfYear(apr, aug);
  const marSept = mergeTimesOfYear(mar, sept);
  const febOct = mergeTimesOfYear(feb, oct);
  const janNov = mergeTimesOfYear(jan, nov);

  // create monthly data array
  const months = [dec, janNov, febOct, marSept, aprAug, mayJuly, june];
  const allMonths = [
    dec,
    jan,
    feb,
    mar,
    apr,
    may,
    june,
    jul,
    aug,
    sept,
    oct,
    nov,
  ];

  // generate each time of the day
  // need to calculate one half then the other then interpolate the results
  const eight = generateTimeOfDayData(allMonths, 8);
  const nine = generateTimeOfDayData(allMonths, 9);
  const ten = generateTimeOfDayData(allMonths, 10);
  const elev = generateTimeOfDayData(allMonths, 11);
  const noon = generateTimeOfDayData(allMonths, 12);
  const thirt = generateTimeOfDayData(allMonths, 13);
  const fourt = generateTimeOfDayData(allMonths, 14);
  const fift = generateTimeOfDayData(allMonths, 15);
  const sixt = generateTimeOfDayData(allMonths, 16);

  const [xs0, xs1] = split(eight[0]);
  const [ys0, ys1] = split(eight[1]);
  const mergedX = interpolate(xs0, xs1);
  const mergedY = interpolate(ys0, ys1);
  const mergedEight = [mergedX, mergedY];
  // const eightMerged = mergeTimesOfDay(eight[])

  const times = [eight, nine, ten, elev, noon, thirt, fourt, fift, sixt];

  return [months, times];

  // how best to represnt a single sun analemma?
  // could create an object to represent it
  // to generate a single analemma you need - it's latitude/longitude (location)
  // an hour time of the day (maybe hours isn't enough? half past hour, quarter etc?)
  // then it should create an x/y point for each hour of the day at that location
  // it should then provide a method to simplify from 12 points - something called get mid-line?

  // then how do we take a bunch of analemma and create a sun-path for each period of the year from it
  // so we could start with an analemma class.
  // then built on top of that we have a sun-path class - the sun path takes a collection of analemma objects
  // from the collection of analemma we should be able to get sun-path at a certain time of year
  // so say const analemma = Analemma().location([location]).hour(23)
  // then create however many of these...
  // then say const sunpath = SunPath().analemma([analemmas])
  // then sunpath.dec(), sunpath.jan(), sunpath
}
