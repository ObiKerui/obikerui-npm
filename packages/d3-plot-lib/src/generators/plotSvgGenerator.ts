/* eslint-disable @typescript-eslint/no-explicit-any */

import { tContainerAttrs } from '../attributes/container';
import { tPlotAttrs } from '../attributes/plot';

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

    const chartGroup = svg.select('g.chart-group');
    const children = chartGroup.selectAll('*');
    const existingElements = children.filter(`g.${obj.plotID}`);

    if (existingElements.size() > 0) {
      return;
    }

    obj.index = children.size();
    obj.plotID = `plot-${obj.index}`;
    obj.clipPathID = obj.plotID;
    chartGroup.append('g').classed(`${obj.plotID}`, true);
  }

  toExport.plot = function (_x: any) {
    if (arguments.length > 0) {
      obj = _x;
      return toExport;
    }
    return obj;
  };

  toExport.container = function (_x: any) {
    if (arguments.length > 0) {
      container = _x;
      return toExport;
    }
    return container;
  };

  return toExport;
}

export default plotSvgGenerator;
