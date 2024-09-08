/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
import * as d3 from 'd3';
import { tPlot } from '../sharedTypes';
import { tConditionParam } from './PlotAttrs';

class Interpolator {
  getMarkers(xs: tConditionParam[], where: (x: tConditionParam) => boolean) {
    let startDataIdx = 0;
    let startIdx = 0;
    let endIdx = xs.length > 0 ? xs.length - 1 : 0;
    let endDataIdx = endIdx;

    for (let i = 0; i < xs.length; i++) {
      if (where(xs[i])) {
        startIdx = i;
        break;
      } else {
        startDataIdx = i;
      }
    }

    for (let i = startIdx; i < xs.length; i++) {
      if (where(xs[i]) === false) {
        endDataIdx = i;
        break;
      } else {
        endIdx = i;
      }
    }

    return {
      startDataIdx,
      startIdx,
      endIdx,
      endDataIdx,
    };
  }

  findXValueStart(startDataX: number, startX: number, where: any) {
    const iterations = 4;
    const multiplier = 0.5;
    let leftBound = startDataX;
    let rightBound = startX;
    let newStartX = startX;

    for (let i = 0; i < iterations; i++) {
      const distance = (rightBound - leftBound) * multiplier;
      newStartX = rightBound - distance;

      const isWithin = where(newStartX);
      // console.log('lefbound / rightbound / newstartX / isWithin ', leftBound, rightBound, newStartX, isWithin)
      if (isWithin) {
        rightBound = newStartX;
      } else {
        leftBound = newStartX;
      }
    }

    return newStartX;
  }

  findXValueEnd(xEndData: number, xEnd: number, where: any) {
    const iterations = 4;
    const multiplier = 0.5;
    let leftBound = xEnd;
    let rightBound = xEndData;
    let newEndX = xEnd;

    for (let i = 0; i < iterations; i++) {
      const distance = (rightBound - leftBound) * multiplier;
      newEndX = rightBound - distance;

      const isWithin = where(newEndX);
      // console.log('lefbound / rightbound / newEndX / isWithin ', leftBound, rightBound, newEndX, isWithin)
      if (isWithin) {
        leftBound = newEndX;
      } else {
        rightBound = newEndX;
      }
    }

    return newEndX;
  }

  interpolate(x0: number, x1: number, x: number, y0: number, y1: number) {
    // what %tage is x of x1 - x0
    const percentage = (x - x0) / (x1 - x0);
    const yDiff = y1 - y0;
    const newY = y0 + yDiff * percentage;

    // console.log('percentage / x / x1 / x0 / yDiff / y1 / y0 / newY ', percentage, x, x1, x0, yDiff, y1, y0, newY)

    return newY;
  }

  update(plot: tPlot) {
    const { xs, ys, where } = plot.attrs;
    const numXs = xs as number[];
    const numYs = ys as unknown as number[];

    if (!where) {
      return null;
    }

    // console.log('xs/ys begin with: ', xs, ys)

    const { startDataIdx, startIdx, endIdx, endDataIdx } = this.getMarkers(
      xs as tConditionParam[],
      where
    );
    const newXs = numXs.slice(startIdx, endIdx + 1);
    const newYs = numYs.slice(startIdx, endIdx + 1);

    // console.log('markers: startData / start / end / endData ', startDataIdx, startIdx, endIdx, endDataIdx)
    // console.log('newxs / newys : ', newXs, newYs)

    if (startDataIdx < startIdx) {
      const xStartData = numXs[startDataIdx];
      const xStart = numXs[startIdx];
      const newStartX = this.findXValueStart(xStartData, xStart, where);
      newXs.unshift(newStartX);

      const yStartData = numYs[startDataIdx];
      const yStart = numYs[startIdx];
      const newStartY = this.interpolate(
        xStartData,
        xStart,
        newStartX,
        yStartData,
        yStart
      );
      newYs.unshift(newStartY);
    }

    if (endIdx < endDataIdx) {
      const xEndData = numXs[endDataIdx];
      const xEnd = numXs[endIdx];
      const newEndX = this.findXValueEnd(xEndData, xEnd, where);
      newXs.push(newEndX);

      const yEndData = numYs[endDataIdx];
      const yEnd = numYs[endIdx];
      const newEndY = this.interpolate(xEnd, xEndData, newEndX, yEnd, yEndData);
      newYs.push(newEndY);
    }

    return {
      newXs,
      newYs,
    };
  }
}

export { Interpolator };
