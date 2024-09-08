import * as d3PlotLib from '@obikerui/d3-plot-lib';
import * as d3 from 'd3';
import { tGridChart } from './Model';

class Chart {
  container;
  constructor() {
    this.container = new d3PlotLib.CContainer();
    this.container.addPlot(new d3PlotLib.CBar());
  }

  update(newModel: tGridChart) {
    const { barContainer, categories, profitLoss } = newModel;

    if (!profitLoss) {
      return;
    }

    const dom = [...Object.keys(profitLoss)];

    const ys = [...Object.values(profitLoss)];
    const max = ys.reduce((sum, curr) => sum + curr, 0);
    // const xs = rangedData.map((elem) => dayjs(elem.uploadTime).toDate());

    this.container.attrs = {
      ...this.container.attrs,
      html: barContainer,
      width: 500,
      height: 200,
      yAxisLabel: categories[0] ?? 'KWs',
      xAxisLabel: '',
      xAxisText: {
        rotation: 0,
      },
      onGetXScale: (chartWidth: number) =>
        d3
          .scaleBand()
          .domain(dom)
          .paddingInner(0.2)
          .rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3
          .scaleLinear()
          .domain([0, max / 1000])
          .rangeRound([chartHeight, 0]),
    } as d3PlotLib.tContainerAttrs;

    const plot = this.container.getPlots()[0];
    plot.attrs = {
      ...plot.attrs,
      labels: dom,
      data: ys,
      colours: ['gray', 'gray'],
      opacity: [0.5, 0.5],
      onGetLabel: (_d: number, ith: number) => dom[ith],
      onGetValue: (d: number) => d / 1000.0,
    } as d3PlotLib.tPlotAttrs;

    this.container.update();
  }
}

export { Chart };
