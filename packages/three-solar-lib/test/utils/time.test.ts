import { describe, test, expect } from 'vitest';
// import * as solar from 'solar-calculator';
// import { render, screen } from '@testing-library/react';
import * as time from '../../src/utils/time';

describe('Tests for Time', () => {
  const startDate = new Date('1970-01-01T00:00:00Z');

  test('test dateTimeToUnixEpoch', () => {
    const timeVal = startDate.getTime();
    expect(time.dateTimeToUnixEpoch(startDate)).toEqual(timeVal);
    expect(time.dateTimeToUnixEpoch(startDate)).toEqual(0);
  });

  test('test unixEpochToDateTime', () => {
    const unixEpoch = 0;
    expect(time.unixEpochToDateTime(unixEpoch)).toEqual(startDate);
  });

  test('test unixEpochToJulianDay', () => {
    // const someDate0 = new Date('2000-01-01T12:00:00Z');
    // const someDate05 = new Date('2050-01-01T12:00:00Z');
    // const someDate1 = new Date('2100-01-01T12:00:00Z');
    // const someDate2 = new Date('2200-01-01T12:00:00Z');
    // const unixDate = time.dateTimeToUnixEpoch(someDate0);
    // expect(time.unixEpochToJulianDay(unixDate)).toEqual(0)
    // const solCent0 = solar.century(someDate0);
    // const solCent05 = solar.century(someDate05);
    // const solCent1 = solar.century(someDate1);
    // const solCent2 = solar.century(someDate2);
    // console.log('sol century: ', solCent0, solCent05, solCent1, solCent2);
    // const unixEpoch = time.dateTimeToUnixEpoch(someDate)
    // const julDay = time.unixEpochToJulianDay(unixEpoch)
    // const mine = time.julianDayToJulianCentury(julDay)
    // console.log('sol century mine: ', mine, julDay, unixEpoch)
  });

  test('test julianDayToUnixEpoch', () => {
    expect(false);
  });

  test('test julianDayToJulianCentury', () => {
    expect(false);
  });

  test('test julianCenturyToJulianDay', () => {
    expect(false);
  });

  // test('test getHourAngle function', () => {
  //     // utils.getHourAngle()
  //     // const longitude_where = 54.5
  //     expect(utils.getHourAngle(firstDay, longitude_ncl)).toEqual(1)
  // })
});
