/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import * as utils from '../utils/units';
import { Months } from '../periods';

type tPositionGenerator = (
  date: Date,
  latitude: number,
  longitude: number
) => {
  altitude: number;
  azimuth: number;
};

function YearDataGenerator() {
  let positionGenerator: tPositionGenerator | null = null;
  let location: any | null = null;
  let data: unknown[] = [];
  let year = 2000;

  function generate(posGenerator: tPositionGenerator, start: Date, loc: number[]) {
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const days = d3.utcDays(start, end, 1);
    const hours = days.flatMap((day) => d3.utcHours(day, new Date(+day + 24 * 3600 * 1000), 1));

    const data = hours.map((date) => {
      const result = posGenerator(date, loc[0], loc[1]);
      return {
        date,
        hour: date.getUTCHours(),
        altitude: result.altitude,
        azimuth: result.azimuth,
      };
    });

    type tData = (typeof data)[number];
    const result: [number[], number[]] = [[], []];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < data.length; i++) {
      const elem = data[i] as tData;
      result[0].push(utils.radiansToDegrees(elem.azimuth));
      result[1].push(elem.altitude);
    }
    return result;
  }

  function toExport() {
    if (!positionGenerator || !location) {
      return;
    }

    const date = new Date(Date.UTC(year, 0, 21));
    data[Months.Jan] = generate(positionGenerator, date, location);
    date.setMonth(1);
    data[Months.Feb] = generate(positionGenerator, date, location);
    date.setMonth(2);
    data[Months.Mar] = generate(positionGenerator, date, location);
    date.setMonth(3);
    data[Months.Apr] = generate(positionGenerator, date, location);
    date.setMonth(4);
    data[Months.May] = generate(positionGenerator, date, location);
    date.setMonth(5);
    data[Months.Jun] = generate(positionGenerator, date, location);
    date.setMonth(6);
    data[Months.Jul] = generate(positionGenerator, date, location);
    date.setMonth(7);
    data[Months.Aug] = generate(positionGenerator, date, location);
    date.setMonth(8);
    data[Months.Sept] = generate(positionGenerator, date, location);
    date.setMonth(9);
    data[Months.Oct] = generate(positionGenerator, date, location);
    date.setMonth(10);
    data[Months.Nov] = generate(positionGenerator, date, location);
    date.setMonth(11);
    data[Months.Dec] = generate(positionGenerator, date, location);
  }

  toExport.location = function (_x: any) {
    if (arguments.length > 0) {
      location = _x;
      return toExport;
    }
    return location;
  };

  toExport.year = function (_x: any) {
    if (arguments.length > 0) {
      year = _x;
      return toExport;
    }
    return year;
  };

  toExport.positionGenerator = function (_x: any) {
    if (arguments.length > 0) {
      positionGenerator = _x;
      return toExport;
    }
    return positionGenerator;
  };

  toExport.data = function (_x: any) {
    if (arguments.length > 0) {
      data = _x;
      return toExport;
    }
    return data;
  };

  return toExport;
}

export default YearDataGenerator;
