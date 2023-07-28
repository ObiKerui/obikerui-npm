/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */

import rfdc from 'rfdc';
import AttrsGenerator from './attributeGenerator';
import AnalemmaGenerator from './analemmaGenerator';
import SunPathGenerator from './sunPathGenerator';
import sunPositionIn900Bytes from '../utils/sun-position-in-900-bytes';

const SunPathAttrs = {
  location: null as number[] | null,
  sunPosGenerator: sunPositionIn900Bytes as any | null,
  yearDataGenerator: null as any | null,
  analemmaGenerator: null as any | null,
  sunPathGenerator: null as any | null,
};

function SolarDataGenerator() {
  const obj = rfdc()(SunPathAttrs);
  let yearData = [] as any[];

  function generate() {
    const { location, yearDataGenerator, sunPosGenerator } = obj;

    if (!yearDataGenerator || !sunPosGenerator) {
      return;
    }

    // const sunPathGen = SolarLib.SunPathGenerator()
    // .location(location)
    // .positionGenerator(SolarLib.SunPos900)
    // .yearDataGenerator(SolarLib.YearDataGenerator)
    // .analemmaGenerator(SolarLib.AnalemmaGenerator)

    // sunPathGen();

    // sunPathGen.analemma(8).xs().ys();
    // sunPathGen.analemma(9).merged().xs().ys();
    // sunPathGen.analemma(10).merged().xs().ys();

    // sunPathGen.sunPath(WinterSolstice).xs().ys();
    // sunPathGen.sunPath(SolarTwin.JanNov).xs().ys();
    // sunPathGen.sunPath(SolarTwin.FebOct).xs().ys();
    // sunPathGen.sunPath(SummerSolstice).xs().ys();
    // sunPathGen.sunPath(SolarTwin.JanNov).xs().ys();
    // sunPathGen.sunPath(SolarTwin.FebOct).xs().ys();

    // generate the yearly data
    const yearDataGen = yearDataGenerator().location(location).positionGenerator(sunPosGenerator);
    yearDataGen();
    yearData = yearDataGen.data();

    // once we have the yearly data we can generate the other data on demand.
  }

  function toExport() {
    generate();
  }

  const generateAccessor = AttrsGenerator();
  generateAccessor.attachTo(obj);
  generateAccessor.setterReturnValue(toExport);

  toExport.location = generateAccessor('location');

  toExport.analemma = function (hour: number) {
    const analemmaGen = obj.analemmaGenerator as typeof AnalemmaGenerator;
    return analemmaGen().hour(hour).yearData(yearData);
  };

  toExport.sunpath = function (period: any) {
    const sunpathGen = obj.sunPathGenerator as typeof SunPathGenerator;
    return sunpathGen().period(period).yearData(yearData);
  };

  return toExport;
}

export default SolarDataGenerator;
