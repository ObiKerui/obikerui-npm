// /* eslint-disable @typescript-eslint/no-explicit-any */
// import * as d3 from 'd3';

// function ShadeDataGenerator() {
//   let positionGenerator: any | null = null;
//   let interpolator: any | null = null;
//   let timesOfDay: any | null = null;
//   let datesOfYear: any | null = null;
//   let interpolatedDates: any | null = null;
//   let interpolateTimes: any | null = null;
//   let location: any | null = null;

//   function generate(start: Date, end: Date, location: number[]) {
//     // why was slice used in the first place?
//     //   const days = d3.utcDays(start, end, 1).slice(0, -1);
//     const days = d3.utcDays(start, end, 1);
//     const hours = days.flatMap((day) => d3.utcHours(day, new Date(+day + 24 * 3600 * 1000), 1));

//     const data = hours.map((date) => ({
//       date,
//       hour: date.getUTCHours(),
//         positionGenerator(date, ...location)
//     }));
//     // .filter((d) => d.altitude >= -0.2);

//     type tData = (typeof data)[number];
//     const result: [number[], number[]] = [[], []];

//     // eslint-disable-next-line no-plusplus
//     for (let i = 0; i < data.length; i++) {
//       const elem = data[i] as tData;
//       result[0].push(SolarLib.radiansToDegrees(elem.azimuth));
//       result[1].push(elem.altitude);
//     }

//     return result;
//   }

// //   function generateDataForDate(date: Date, location: number[]) {
// //     const endDate = new Date(date);
// //     endDate.setDate(date.getDate() + 1);
// //     return generate(date, endDate, location);
// //   }

//   function generateDates(dataGenerator: any, location: any) {
//     const start = new Date();
//     const end = new Date(start);
//     end.setDate(start.getDate() + 1);
//     generateDataForDate(dataGenerator, start, end, location)
//   }

//   function gernerateTimes(dataGenerator: any) {}

//   function interpolateDates(interpolator: any, datesOfYear: any) {}

//   function interpolateTime(interpolator: any, timesOfDay: any) {}

//   function toExport() {
//     // get the alt-azimuth data generator
//     if (!positionGenerator) {
//       return;
//     }
//     datesOfYear = generateDates(positionGenerator);
//     timesOfDay = gernerateTimes(positionGenerator);
//     interpolatedDates = interpolateDates(interpolator, datesOfYear);
//     interpolateTimes = interpolateTime(interpolator, timesOfDay);
//   }

//   toExport.location = function(_x: any) {
//     if (arguments.length > 0) {
//         location = _x;
//         return toExport;
//       }
//       return location;
//   }

//   toExport.positionGenerator = function (_x: any) {
//     if (arguments.length > 0) {
//       positionGenerator = _x;
//       return toExport;
//     }
//     return positionGenerator;
//   };

//   toExport.interpolator = function (_x: any) {
//     if (arguments.length > 0) {
//       interpolator = _x;
//       return toExport;
//     }
//     return interpolator;
//   };

//   toExport.timesOfDay = function (_x: any) {
//     if (arguments.length > 0) {
//       container = _x;
//       return toExport;
//     }
//     return container;
//   };

//   toExport.dates = function (_x: any) {
//     if (arguments.length > 0) {
//       container = _x;
//       return toExport;
//     }
//     return container;
//   };

//   return toExport;
// }

// export default ShadeDataGenerator;
