/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
// This file will not be type-checked by TypeScript
import rfdc from 'rfdc';
import AttrsGenerator from './attributeGenerator';

const analemmaGenAttrs = {
  hour: null as number | null,
  yearData: null as any | null,
  xs: [] as number[],
  ys: [] as number[],
  xsMerged: [] as number[],
  ysMerged: [] as number[],
};

function interpolate(dataX: number, dataY: number) {
  return dataX + (dataY - dataX) / 2;
}

function mergePeriods(periodA: number[][], periodB: number[][], hour: number) {
  const [aXs, aYs] = periodA;
  const [bXs, bYs] = periodB;

  const xAccessError = !aXs || !aXs[hour] || !bXs || !bXs[hour];
  const yAccessError = !aYs || !aYs[hour] || !bYs || !bYs[hour];  
  if(xAccessError || yAccessError) {
    throw new Error('periods not defined');
  }

  const mergedXs = interpolate(aXs[hour], bXs[hour]);
  const mergedYs = interpolate(aYs[hour], bYs[hour]);

  return [mergedXs, mergedYs];
}

function AnalemmaGenerator() {
  const obj = rfdc()(analemmaGenAttrs);

  function generate(mdata: number[][][]) {
    obj.xs = [];
    obj.ys = [];
    obj.xsMerged = [];
    obj.ysMerged = [];
    const { hour } = obj;

    if (!hour) {
      return;
    }

    // array of length 12 for each month, each month contains xs/ys
    // xs/ys is 24 entries for each hour of the day
    for (let i = 0; i < mdata.length; i++) {
      const [xValues, yValues] = mdata[i] as number[][];
      const xValue = xValues[hour];
      const yValue = yValues[hour];
      obj.xs.push(xValue);
      obj.ys.push(yValue);
    }

    // do interpolation of overlapping months
    const [janNovXs, janNovYs] = mergePeriods(mdata[0], mdata[10], hour);
    const [febOctXs, febOctYs] = mergePeriods(mdata[1], mdata[9], hour);
    const [marSeptXs, marSeptYs] = mergePeriods(mdata[2], mdata[8], hour);
    const [aprAugXs, aprAugYs] = mergePeriods(mdata[3], mdata[7], hour);
    const [mayJulXs, mayJulYs] = mergePeriods(mdata[4], mdata[6], hour);
    const [juneXs, juneYs] = mergePeriods(mdata[5], mdata[5], hour);
    const [decXs, decYs] = mergePeriods(mdata[11], mdata[11], hour);

    obj.xsMerged.push(decXs);
    obj.xsMerged.push(janNovXs);
    obj.xsMerged.push(febOctXs);
    obj.xsMerged.push(marSeptXs);
    obj.xsMerged.push(aprAugXs);
    obj.xsMerged.push(mayJulXs);
    obj.xsMerged.push(juneXs);

    obj.ysMerged.push(decYs);
    obj.ysMerged.push(janNovYs);
    obj.ysMerged.push(febOctYs);
    obj.ysMerged.push(marSeptYs);
    obj.ysMerged.push(aprAugYs);
    obj.ysMerged.push(mayJulYs);
    obj.ysMerged.push(juneYs);
  }

  function toExport() {
    const { yearData, hour } = obj;

    if (!yearData || !hour) {
      return;
    }
    generate(yearData);
  }

  const generateAccessor = AttrsGenerator();
  generateAccessor.attachTo(obj);
  generateAccessor.setterReturnValue(toExport);

  toExport.hour = generateAccessor('hour');
  toExport.yearData = generateAccessor('yearData');
  toExport.xs = generateAccessor('xs');
  toExport.ys = generateAccessor('ys');
  toExport.xsMerged = generateAccessor('xsMerged');
  toExport.ysMerged = generateAccessor('ysMerged');

  return toExport;
}

export default AnalemmaGenerator;
export type tAnalemmaGenAttrs = typeof analemmaGenAttrs;
