import { describe, test, expect } from 'vitest';
// import { render, screen } from '@testing-library/react';
import * as utils from '../../src/utils/sun';

describe('Tests for Utils', () => {
  const firstDay = new Date('2023-01-01T12:00:00Z');
  const secondDay = new Date('2023-01-02T12:00:00Z');
  const middleDay = new Date('2023-07-02T12:00:00Z');
  const lastDay = new Date('2023-12-31T12:00:00Z');
  const longitudeNcl = -1.6178;

  test('test getUTCDayOfYear function', () => {
    expect(utils.getUTCDayOfYear(firstDay)).toEqual(1);
    expect(utils.getUTCDayOfYear(secondDay)).toEqual(2);
    expect(utils.getUTCDayOfYear(middleDay)).toEqual(183);
    expect(utils.getUTCDayOfYear(lastDay)).toEqual(365);
  });

  test.only('test getHourAngle function', () => {
    // utils.getHourAngle()
    // const longitude_where = 54.5
    expect(utils.getHourAngle(firstDay, longitudeNcl)).toEqual(1);
  });

  test('test getSolarNoon function', () => {
    // console.log('solar noon ', utils.getSolarNoon(middleDay, longitude_ncl).toISOString());
    expect(utils.getSolarNoon(middleDay, longitudeNcl)).toEqual(0);
  });

  test('test getSolarDeclination function', () => {
    const vernalEquinox = new Date('2023-03-20T12:00:00Z');
    const summerSolstice = new Date('2023-06-21T12:00:00Z');
    const autumnEquinox = new Date('2023-09-22T12:00:00Z');
    const winterSolstice = new Date('2023-12-22T12:00:00Z');

    expect(+utils.getSolarDeclination(vernalEquinox).toFixed(2)).toEqual(-1.31);
    expect(+utils.getSolarDeclination(summerSolstice).toFixed(2)).toEqual(
      23.44
    );
    expect(+utils.getSolarDeclination(autumnEquinox).toFixed(2)).toEqual(-0.1);
    expect(+utils.getSolarDeclination(winterSolstice).toFixed(2)).toEqual(
      -23.45
    );
  });
});
