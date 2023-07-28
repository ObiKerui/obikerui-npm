/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */

function DataFormatter() {
  let xs = null as null | any;
  let ys = null as null | any;
  let xsFormatted = null as null | any;
  let ysFormatted = null as null | any;

  function toExport() {
    if (!xs || !ys) {
      return;
    }

    // check that xs is array
    const xsIsArray = Array.isArray(xs);
    if (!xsIsArray) {
      throw new Error('xs should be an array');
    }
    const xsContainsArray = xs.length > 0 && Array.isArray(xs[0]);
    if (!xsContainsArray) {
      xsFormatted = [xs];
    } else {
      xsFormatted = xs;
    }

    // check that ys is array
    const ysIsArray = Array.isArray(ys);
    if (!ysIsArray) {
      throw new Error('ys should be an array');
    }
    const ysContainsArray = ys.length > 0 && Array.isArray(ys[0]);
    if (!ysContainsArray) {
      ysFormatted = [ys];
    } else {
      ysFormatted = ys;
    }
  }

  toExport.xs = function (_x: any) {
    if (_x) {
      xs = _x;
      return toExport;
    }
    return xs;
  };

  toExport.ys = function (_x: any) {
    if (_x) {
      ys = _x;
      return toExport;
    }
    return ys;
  };

  toExport.xsFormatted = function (_x: any) {
    if (_x) {
      xsFormatted = _x;
      return toExport;
    }
    return xsFormatted;
  };

  toExport.ysFormatted = function (_x: any) {
    if (_x) {
      ysFormatted = _x;
      return toExport;
    }
    return ysFormatted;
  };

  return toExport;
}

export { DataFormatter };

export type tDataFormatter = typeof DataFormatter;
