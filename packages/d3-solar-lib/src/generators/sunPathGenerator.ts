/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import rfdc from 'rfdc';
import AttrsGenerator from './attributeGenerator';
import { AllPeriods } from '../periods';

const sunPathGenAttrs = {
  yearData: null as any | null,
  period: AllPeriods.Dec as AllPeriods,
  xs: [] as number[],
  ys: [] as number[],
};

function interpolate(dataX: number, dataY: number) {
  return dataX + (dataY - dataX) / 2;
}

function interpolateArray(arrX: number[], arrY: number[]) {
  return arrX.map((elem: number, ith: number) => interpolate(elem, arrY[ith]));
}

function mergePeriods(periodA: number[][], periodB: number[][]) {
  const [aXs, aYs] = periodA;
  const [bXs, bYs] = periodB;

  const mergedXs = interpolateArray(aXs, bXs);
  const mergedYs = interpolateArray(aYs, bYs);

  return [mergedXs, mergedYs];
}

function isMonthPeriod(period: AllPeriods) {
  return period >= AllPeriods.Jan && period <= AllPeriods.Dec;
}

function isSolarTwin(period: AllPeriods) {
  return period >= AllPeriods.JanNov && period <= AllPeriods.MayJul;
}

function getSolarTwinIndices(period: AllPeriods) {
  switch (period) {
    case AllPeriods.JanNov:
      return [0, 10];
    case AllPeriods.FebOct:
      return [1, 9];
    case AllPeriods.MarSept:
      return [2, 8];
    case AllPeriods.AprAug:
      return [3, 7];
    case AllPeriods.MayJul:
      return [4, 6];
    default:
      throw new Error('Unknown Period Requested');
  }
}

function SunPathGenerator() {
  const obj = rfdc()(sunPathGenAttrs);

  function generate(ydata: any, period: AllPeriods) {
    // year data is a 12 element array where each element contains:
    // [ xs[24], ys[24] ] 24 for each hour of the day

    // let's just do december for now...
    obj.xs = [];
    obj.ys = [];

    // if the requested period is a month value
    if (isMonthPeriod(period)) {
      const monthRequired = ydata[period];
      const [xs, ys] = monthRequired;
      obj.xs = xs;
      obj.ys = ys;
    }

    if (isSolarTwin(period)) {
      const [x, y] = getSolarTwinIndices(period);
      const [solarTwinXs, solarTwinYs] = mergePeriods(ydata[x], ydata[y]);
      obj.xs = solarTwinXs;
      obj.ys = solarTwinYs;
    }
  }

  function toExport() {
    const { yearData, period } = obj;

    if (!yearData || !period) {
      return;
    }
    generate(yearData, period);
  }

  const generateAccessor = AttrsGenerator();
  generateAccessor.attachTo(obj);
  generateAccessor.setterReturnValue(toExport);

  toExport.period = generateAccessor('period');
  toExport.yearData = generateAccessor('yearData');
  toExport.xs = generateAccessor('xs');
  toExport.ys = generateAccessor('ys');

  return toExport;
}

export default SunPathGenerator;
export type tSunPathGenAttrs = typeof sunPathGenAttrs;
