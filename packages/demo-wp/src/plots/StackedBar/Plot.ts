/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import { tChartData, tAverageData } from './DataGrouper';

class Plot {
  container: d3PlotLib.CContainer;
  constructor() {
    this.container = new d3PlotLib.CContainer();
    this.container.addPlot(new d3PlotLib.CStacked());
    this.container.addPlot(new d3PlotLib.CBandLine());
  }

  update(model: tChartData) {
    const { container } = this;
    const { chartRef: plotContainer, groupedData, averageData } = model;

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

    const bandline = container.getPlots()[1];
    bandline.attrs = {
      ...bandline.attrs,
      xs: labels,
      colours,
      stackedDataset: averageData,
      onGetLabel: (d: tAverageData) => d.key,
      onGetValue: (d: tAverageData) => d.value,
    } as d3PlotLib.tPlotAttrs;

    container.update();
  }
}

export { Plot };