import getSunPosition from './sun-position-in-900-bytes';

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-use-before-define */
export function test() {
  // const vernalEquinox = new Date("2023-03-20T12:00:00Z")
  // const summerSolstice = new Date("2023-06-21T12:00:00Z")
  // const autumnEquinox = new Date("2023-09-23T12:00:00Z")
  // const winterSolstice = new Date("2023-12-22T12:00:00Z")

  // console.log(`The sun's declination on ${date.toISOString()} is ${declination} degrees.`)
  // console.log(`vernal equinox should be 0 ${vernalEquinox.toISOString()} is ${getSolarDeclination(vernalEquinox)} degrees.`)
  // console.log(`summer solstice shoudl be 23.45 ${summerSolstice.toISOString()} is ${getSolarDeclination(summerSolstice)} degrees.`)
  // console.log(`autumnal equinox should be 0 ${autumnEquinox.toISOString()} is ${getSolarDeclination(autumnEquinox)} degrees.`)
  // console.log(`winter solstice should be -23.45 ${winterSolstice.toISOString()} is ${getSolarDeclination(winterSolstice)} degrees.`)

  const latitude = 54.9778;
  const longitude = 1.6129;
  const theDate = new Date('2023-04-26T13:10:00Z');
  const solarAlt = getSolarAltitude(theDate, latitude, longitude);
  console.log('solar alt: ', solarAlt);

  // example given here:
  // https://www.omnicalculator.com/physics/sun-angle
  // st louis 38.6,90.2 on 20th Feb 2023 at 3pm.
  const dateTime = new Date('2023-02-20T15:00:00Z');
  const solLatitude = 38.6;
  const solLongitude = -90.1;
  const solSolarAlt = getSolarAltitude(dateTime, solLatitude, solLongitude);
  const solHourAngle = getHourAngle(dateTime, solLongitude);
  console.log('answer I get is : ', solHourAngle, solSolarAlt);

  // test getting the year day
  const firstDayOfYear = getUTCDayOfYear(new Date('2023-01-01T12:00:00Z'));
  const today = getUTCDayOfYear(new Date());
  const middleDayOfYear = getUTCDayOfYear(new Date('2023-06-15T12:00:00Z'));
  const lastDayOfYear = getUTCDayOfYear(new Date('2023-12-31T12:00:00Z'));

  console.log('Year Day Test first day: ', firstDayOfYear);
  console.log('Year Day Test today: ', today);
  console.log('Year Day Test middle day: ', middleDayOfYear);
  console.log('Year Day Test last day: ', lastDayOfYear);

  // test getting the hour angle
}

function getSolarAltitude(date: Date, latitude: number, longitude: number) {
  const declination = getSolarDeclination(date);
  const hourAngle = getHourAngle(date, longitude);

  console.log('hour angle: ', hourAngle);
  const piby180 = Math.PI / 180;
  const a = Math.sin(latitude * piby180);
  const b = Math.sin(declination * piby180);
  const c = Math.cos(latitude * piby180);
  const d = Math.cos(declination * piby180);
  const e = Math.cos(hourAngle * piby180);
  const altitude = a * b * c * d * e;
  const asinAlt = Math.asin(altitude) * piby180;

  // const altitude = Math.asin(Math.sin(lat * (Math.PI / 180)) * Math.sin(declination * (Math.PI / 180)) + Math.cos(lat * (Math.PI / 180)) * Math.cos(declination * (Math.PI / 180)) * Math.cos(hourAngle * (Math.PI / 180))) * (180 / Math.PI);
  return asinAlt;
}

function getUTCDayOfYear(date: Date): number {
  const jan1 = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const diff = date.getTime() - jan1.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear + 1;
}

function getSolarDeclination(date: Date) {
  // num days since start of year
  const startOfYear = new Date(date.getFullYear(), 0, 1); // Create a new date object for the start of the year
  const diffInTime = date.getTime() - startOfYear.getTime(); // Get the difference in milliseconds between the two dates
  const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24)); // Convert the difference to days and round down to the nearest integer

  const degToRad = (degrees: number) => {
    const pi = Math.PI;
    return degrees * (pi / 180);
  };

  const declination =
    -23.45 * Math.cos(degToRad((360.0 / 365.0) * (diffInDays + 10)));
  return declination;
}

function getHourAngle(date: Date, _longitude: number) {
  // divide longitude by 15 degrees to get time diff
  // const divBy15 = longitude / 15.0;
  // convert above to hours or time unit?

  // const next = 12 + divBy15;
  // const ha = 15.0 * (date.getUTCHours() - 12);

  // console.log(' div by 15 and local solar noon: ', divBy15, next, date.getUTCHours())

  // in hours
  // const solarAngleHours = 15.0 * (date.getUTCHours() - 12);
  const solarHourAngleMins =
    15.0 * (date.getUTCHours() + date.getUTCMinutes() / 60 - 12);

  // const hourAngle = (date.getUTCHours() + date.getUTCMinutes() / 60 - 12) * 15 + longitude;
  return solarHourAngleMins;
}

// Location coordinates in degrees
// const latitude = 40.7128;
// const longitude = -74.006;

// Date and time information
// const date = new Date();
// const yearDay = getYearDay(date);
// const timezoneOffset = date.getTimezoneOffset() / 60;
// const localTime = date.getHours() + date.getMinutes() / 60 + timezoneOffset;

// Calculation of solar noon
// const solarNoon = (longitude / 15) + 12 - equationOfTime(yearDay);

// Calculation of hour angle
// let hourAngle = 15 * (localTime - solarNoon);
// if (hourAngle > 180) {
//   hourAngle -= 360;
// } else if (hourAngle < -180) {
//   hourAngle += 360;
// }

// Output the result in degrees
// console.log(`The sun's hour angle is ${hourAngle.toFixed(2)} degrees.`);

// Helper function to calculate the equation of time
function getEquationOfTime(yearDay: number): number {
  const b = ((yearDay - 81) * 360) / 365;
  const equation =
    9.87 * Math.sin((2 * b * Math.PI) / 180) -
    7.53 * Math.cos((b * Math.PI) / 180) -
    1.5 * Math.sin((b * Math.PI) / 180);
  return equation / 60;
}

// function getSolarTime() {
//   // solar time − standard time = 4(𝐿st − 𝐿loc) + E
// }

function getSolarNoon(date: Date, longitude: number) {
  // Solar noon = 12:00 PM - (longitude / 15) + (equation of time)
  // Convert longitude to hours
  const longitudeInHours = longitude / 15;

  // Calculate the difference between solar time and clock time
  const timeOffset = date.getTimezoneOffset() / 60;

  // Calculate the time of solar noon
  const solarNoon = new Date(date);
  solarNoon.setHours(12 - longitudeInHours - timeOffset);

  // Adjust for daylight saving time
  const isDaylightSavingTime =
    date.getTimezoneOffset() < solarNoon.getTimezoneOffset();
  if (isDaylightSavingTime) {
    solarNoon.setHours(solarNoon.getHours() - 1);
  }

  console.log('set hours is ', 12 - longitudeInHours - timeOffset);
  console.log('what is tz offset: ', date.getTimezoneOffset(), timeOffset);
  console.log('what is solar noon ', solarNoon);
  return solarNoon;
}

function getSunAltitudeAzimuth(
  date: Date,
  latitude: number,
  longitude: number
) {
  return getSunPosition(date.getTime(), longitude, latitude);
}
// export default function(date, longitude) {
//   var t = century(+day(date) + (12 - longitude * 24 / 360) * 36e5), // First approximation.
//       o1 = 720 - longitude * 4 - equationOfTime(t - longitude / (360 * 36525)), // First correction.
//       o2 = 720 - longitude * 4 - equationOfTime(t + o1 / (1440 * 36525)); // Second correction.
//   return new Date(+day(date) + o2 * 1000 * 60);
// }

export {
  getUTCDayOfYear,
  getSolarAltitude,
  getSolarDeclination,
  getHourAngle,
  getEquationOfTime,
  getSolarNoon,
  getSunAltitudeAzimuth,
  // task list
  // getJulianCenturiesSinceJ2000
  // getGeometricMeanOfSun,
  // getMeanAnomalyOfSun,
  // getEccentricityOfEarthOrbit,
  // getSunsEquationOfCentre,
  // getSunsGeometricLongitude,
  // getSunsTrueAnomaly,
  // getSunsRadiusVector,
  // correctForMutationAndAberration,
  // getApparentLongitude,
  // getObliquityOfEcliptic,
  // correctForParallax,
  // getRightAscension
  // getDeclination
  // getSolarCoordinates
};
