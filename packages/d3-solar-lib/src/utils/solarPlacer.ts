/* eslint-disable @typescript-eslint/no-explicit-any */

import rfdc from 'rfdc';

const attrs = {
  boundaries: null as unknown | null,
  solarArray: null as unknown | null,
};

function SolarPlacer() {
  const obj = rfdc()(attrs);

  // function generateAccessor(attr: keyof typeof obj) {
  //   /* eslint-disable @typescript-eslint/no-explicit-any */
  //   function accessor<Type>(value: Type): any {
  //     if (!arguments.length) {
  //       return obj[attr];
  //     }
  //     obj[attr] = value as never;

  //     return retVal;
  //   }
  //   return accessor;
  // }

  function toExport() {
    // return generateAccessor(attrName);
  }

  toExport.boundaries = function (plot: unknown) {
    if (arguments.length > 0) {
      obj.boundaries = plot;
      return toExport;
    }
    return obj.boundaries;
  };

  toExport.solarArray = function (plot: unknown) {
    if (arguments.length > 0) {
      obj.solarArray = plot;
      return toExport;
    }
    return obj.solarArray;
  };

  return toExport;
}

export default SolarPlacer;
