/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import * as d3PlotLib from '@obikerui/d3-plot-lib';

type tModel = {
  container: HTMLDivElement | null;
  plotData: unknown[];
  minMax: [number, number];
  labels: string[];
  colours: string[];
  categories: string[];
};

class Plot {
  container: d3PlotLib.CContainer;
  model: tModel;
  constructor() {
    this.model = {
      container: null,
      plotData: [],
      minMax: [0, 0],
      colours: [],
      labels: [],
      categories: [],
    };

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

  update(model: tModel) {
    const { container } = this;
    const {
      container: plotContainer,
      plotData,
      labels,
      categories,
      colours,
    } = model;

    const dataGen = d3.stack().keys(categories).order(d3.stackOrderAscending);
    const stackedData = dataGen(plotData as { [key: string]: number }[]);

    // console.log('labels: ', labels, plotData, stackedData);

    container.attrs = {
      ...container.attrs,
      html: plotContainer,
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
    console.log('updated the container...');
  }
}

export type { tModel };
export { Plot };
