/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import { PlotModel } from './Model';

class STPlot {
  container: d3PlotLib.CContainer;
  ref: HTMLDivElement | null;
  constructor() {
    this.ref = null;

    const container = new d3PlotLib.CContainer();
    container.addPlot(new d3PlotLib.CLines());

    const newContAttrs = {
      ...container.attrs,
      onGetXScale: (chartWidth: number) =>
        d3.scaleLinear().domain([]).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tContainerAttrs;

    container.attrs = newContAttrs;
    container.update();
    this.container = container;
  }

  update(model: PlotModel) {
    const { container } = this;
    const { pageElements } = model;

    const updatedAttrs = {
      ...container.attrs,
      html: pageElements.linePlotDiv,
      xAxisLabel: 'line x label',
      yAxisLabel: 'line y label',
      onGetXScale: (chartWidth: number) =>
        d3.scaleLinear().domain([0, 10]).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([0, 10]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tContainerAttrs;

    container.attrs = updatedAttrs;

    const lines = container.plots[0];
    lines.attrs = {
      ...lines.attrs,
      xs: [0, 1, 2, 3, 4, 5, 6],
      ys: [2, 3, 4, 5, 6, 7, 7],
    } as d3PlotLib.tPlotAttrs;

    container.update();
  }
}

export { STPlot };
