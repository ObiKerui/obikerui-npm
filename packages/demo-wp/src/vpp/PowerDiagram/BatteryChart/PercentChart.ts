import * as d3PlotLib from '@obikerui/d3-plot-lib';
import * as d3 from 'd3';
import { tBatteryChart } from './Model';

class Chart {
  container;
  constructor() {
    this.container = new d3PlotLib.CContainer();
    this.container.addPlot(new d3PlotLib.CBar());
  }

  update(newModel: tBatteryChart) {
    const { barContainer, categories, percentages } = newModel;

    if (!percentages) {
      return;
    }

    const dom = [...Object.keys(percentages)];

    const ys = [...Object.values(percentages)];
    console.log('what are percentages? ', ys, dom[0], dom[1]);
    // const xs = rangedData.map((elem) => dayjs(elem.uploadTime).toDate());

    this.container.attrs = {
      ...this.container.attrs,
      html: barContainer,
      width: 500,
      height: 400,
      yAxisLabel: 'Battery % (soc)',
      xAxisText: {
        rotation: 0,
      },
      xAxisLabel: 'Battery State',
      onGetXScale: (chartWidth: number) =>
        d3
          .scaleBand()
          .domain(dom)
          .paddingInner(0.2)
          .rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([0, 100]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tContainerAttrs;

    const plot = this.container.getPlots()[0];
    plot.attrs = {
      ...plot.attrs,
      labels: dom,
      data: ys,
      onGetLabel: (_d: number, ith: number) => dom[ith],
      onGetValue: (d: number) => d * 100,
    } as d3PlotLib.tPlotAttrs;

    this.container.update();
  }
}

export { Chart };
// // const chart = new Chart();

// // useBatteryChart.subscribe((newModel) => {
// //   chart.update(newModel);
// // });
