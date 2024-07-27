/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import { tChartData } from './DataGrouper';

class Plot {
  container: d3PlotLib.CContainer;
  constructor() {
    const container = new d3PlotLib.CContainer();
    container.addPlot(new d3PlotLib.CStacked());

    const newContAttrs = {
      ...container.attrs,
      onGetXScale: (chartWidth: number) =>
        d3.scaleBand().domain([]).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tContainerAttrs;

    container.attrs = newContAttrs;
    container.update();
    this.container = container;
  }

  update(model: tChartData) {
    const { container } = this;
    const { chartRef: plotContainer, groupedData } = model;

    if (!groupedData) {
      return;
    }
    const { data: plotData, labels, categories, colours } = groupedData;

    const dataGen = d3.stack().keys(categories).order(d3.stackOrderAscending);
    const stackedData = dataGen(
      plotData as unknown as { [key: string]: number }[]
    );

    container.attrs = {
      ...container.attrs,
      html: plotContainer,
      xAxisText: {
        rotation: 45,
        onRender: (d) => d,
      },
      onGetXScale: (chartWidth: number) =>
        d3
          .scaleBand()
          .domain(labels)
          .paddingInner(0.2)
          .rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([0, 20]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tContainerAttrs;

    const stackedBar = container.getPlots()[0];
    stackedBar.attrs = {
      ...stackedBar.attrs,
      xs: labels,
      colours,
      stackedDataset: stackedData,
    } as d3PlotLib.tPlotAttrs;

    container.update();
  }
}

export { Plot };
