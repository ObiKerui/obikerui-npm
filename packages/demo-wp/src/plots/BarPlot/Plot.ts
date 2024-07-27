// import { atom } from 'jotai';
import * as d3 from 'd3';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import { tChartData, tAveraged, tMetric } from './DataGrouper';

class BarPlot {
  container: d3PlotLib.CContainer;

  constructor() {
    this.container = new d3PlotLib.CContainer();
    this.container.addPlot(new d3PlotLib.CBar());
    // this.container.update();
  }

  getMetric(metric: tMetric, data: tAveraged) {
    switch (metric) {
      case 'Avg Consumption':
        return data.avgConsumption;
      case 'Avg Export':
        return data.avgExport;
      case 'Avg Price Per KwH':
        return data.avgPPKWH;
      default:
        return 0;
    }
  }

  update(barPlotModel: tChartData) {
    const { chartRef, groupedData, metric } = barPlotModel;

    if (!groupedData) {
      return;
    }

    const { labels } = groupedData;

    this.container.attrs = {
      ...this.container.attrs,
      html: chartRef,
      xAxisText: {
        ...this.container.attrs.xAxisText,
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
    };

    const bars = this.container.getPlots()[0];
    bars.attrs = {
      ...bars.attrs,
      labels,
      stackedDataset: groupedData.data,
      onGetValue: (d: tAveraged) => this.getMetric(metric, d),
      onGetLabel: (d: tAveraged) => d.key,
    } as d3PlotLib.tPlotAttrs;

    this.container.update();
  }
}

export { BarPlot };
