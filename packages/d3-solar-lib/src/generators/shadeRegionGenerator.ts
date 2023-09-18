/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import rfdc from 'rfdc';
import AttrsGenerator from './attributeGenerator';
import { AllPeriods } from '../periods';

const shadeRegionGenAttrs = {
  yearData: null as any | null,
  period: AllPeriods.Dec as AllPeriods,
  xs: [] as number[],
  ys: [] as number[],
  sunpathXs: [] as any,
  sunpathYs: [] as any,
  data: [] as any,
};

function createCoordinates(startX: number[], nextX: number[], position: number) {
  const x0 = startX[position];
  const x1 = startX[position + 1];
  const x2 = nextX[position + 1];
  const x3 = nextX[position];

  return [x0, x1, x2, x3];
}

function ShadeRegionGenerator() {
  const obj = rfdc()(shadeRegionGenAttrs);

  function generate() {
    obj.xs = [];
    obj.ys = [];
    obj.data = [];

    if (obj.sunpathXs.length < 2) {
      return;
    }

    // for each sun path
    for (let i = 0; i < obj.sunpathXs.length - 1; i++) {
      // for each of the 24 hours in the x/y coords.
      const xPath = obj.sunpathXs[i];
      const xPathNext = obj.sunpathXs[i + 1];
      const yPath = obj.sunpathYs[i];
      const yPathNext = obj.sunpathYs[i + 1];

      // the coords at index of 0 seem to be screwed up, start loop at 1 instead
      for (let j = 1; j < xPath.length - 1; j += 1) {
        const xCoords = createCoordinates(xPath, xPathNext, j);
        const yCoords = createCoordinates(yPath, yPathNext, j);
        obj.data.push({ xCoords, yCoords });
      }
    }
  }

  function toExport() {
    generate();
  }

  const generateAccessor = AttrsGenerator();
  generateAccessor.attachTo(obj);
  generateAccessor.setterReturnValue(toExport);

  toExport.sunpathXs = generateAccessor('sunpathXs');
  toExport.sunpathYs = generateAccessor('sunpathYs');
  toExport.data = generateAccessor('data');
  toExport.xs = generateAccessor('xs');
  toExport.ys = generateAccessor('ys');

  return toExport;
}

export default ShadeRegionGenerator;
export type tShadeRegionGenAttrs = typeof shadeRegionGenAttrs;
