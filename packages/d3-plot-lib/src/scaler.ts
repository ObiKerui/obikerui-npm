/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import * as d3 from 'd3';
import { tContainerAttrs } from './container';
// import { ScaleLinear, ScaleBand, ScaleTime, ScaleOrdinal, ScalePower, ScaleLogarithmic } from 'd3';

// type tGenericScale<D, R> =
//   | ScaleLinear<D, R>
//   | ScaleBand<string>
//   | ScaleTime<D, R>
//   | ScaleOrdinal<string, R>
//   | ScalePower<D, R>
//   | ScaleLogarithmic<D, R>;

export type tPlottable = {
  xs: () => d3.AxisDomain[];
  ys: () => d3.AxisDomain[] | d3.AxisDomain[][];
};

type tXScaleCallback = (xs: d3.AxisDomain[][], chartWidth: number) => d3.AxisScale<d3.AxisDomain>;
type tYScaleCallback = (ys: d3.AxisDomain[][], chartHeight: number) => d3.AxisScale<d3.AxisDomain>;

// type tXScaleCallback<D, R> = (xs: d3.AxisDomain[][], chartWidth: number) => tGenericScale<D, R>;
// type tYScaleCallback<D, R> = (ys: d3.AxisDomain[][], chartHeight: number) => tGenericScale<D, R>;

function Scaler() {
  let xScalerCallback = null as tXScaleCallback | null;
  let yScalerCallback = null as tYScaleCallback | null;

  function flatten<T>(arr: T[][]): T[] {
    return ([] as T[]).concat(...arr);
  }

  function toExport(containerAttrs: tContainerAttrs, plottables: tPlottable[]) {
    const xs: d3.AxisDomain[][] = [];
    const ys: d3.AxisDomain[][] = [];

    // create a 2d array - each entry is an array of the y values
    // would not have to do this if plottable provides ys already in 2d array format...
    plottables.forEach((plottable: tPlottable) => {
      const plotXS = plottable.xs();

      if (Array.isArray(plotXS)) {
        xs.push(plotXS);
      }

      // console.log('scaler what are xs/processed: ', plotXS, xs, plotXS.length, xs.length);

      const plotYS = plottable.ys();

      if (Array.isArray(plotYS)) {
        const firstElem = plotYS[0];
        if (Array.isArray(firstElem)) {
          const elems = flatten(plotYS as d3.AxisDomain[][]);
          ys.push(elems);
        } else {
          ys.push(plotYS as d3.AxisDomain[]);
        }
      }

      // console.log('scaler what are ys: ', plotYS, ys, plotYS.length, ys.length);
    });

    // get/compute the chart width/height (may add padding to this in future)
    const { chartWidth, chartHeight } = containerAttrs;

    if (xScalerCallback) {
      containerAttrs.xScale = xScalerCallback(xs, chartWidth);
    }

    if (yScalerCallback) {
      containerAttrs.yScale = yScalerCallback(ys, chartHeight);
    }
  }

  toExport.xScaleCallback = function (_x: tXScaleCallback | undefined) {
    if (_x) {
      xScalerCallback = _x;
      return toExport;
    }
    return xScalerCallback;
  };

  toExport.yScaleCallback = function (_x: tYScaleCallback | undefined) {
    if (_x) {
      yScalerCallback = _x;
      return toExport;
    }
    return yScalerCallback;
  };
  return toExport;
}

export { Scaler };

export type tScaler = typeof Scaler;
