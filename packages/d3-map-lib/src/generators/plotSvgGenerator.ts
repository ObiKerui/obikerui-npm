/* eslint-disable @typescript-eslint/no-explicit-any */

import { tContainerAttrs } from '../attributes/container';
import { tPlotAttrsOld as tPlotAttrs } from '../attributes/plot';

function plotSvgGenerator() {
  let obj: tPlotAttrs | null = null;
  let container: tContainerAttrs | null = null;

  function toExport() {
    if (!container || !obj) {
      return;
    }

    const { svg } = container;
    if (!svg) {
      return;
    }

    const chartGroup = svg.select('g.map-group');
    const children = chartGroup.selectAll('*');
    const existingElements = children.filter(`g.${obj.plotID}`);

    if (existingElements.size() > 0) {
      return;
    }

    obj.index = children.size();
    obj.plotID = `plot-${obj.index}`;
    chartGroup.append('g').classed(`${obj.plotID}`, true);
  }

  toExport.plot = function (x: any) {
    if (arguments.length > 0) {
      obj = x;
      return toExport;
    }
    return obj;
  };

  toExport.container = function (x: any) {
    if (arguments.length > 0) {
      container = x;
      return toExport;
    }
    return container;
  };

  return toExport;
}

export default plotSvgGenerator;
