// import { atom } from 'jotai';
import * as d3 from 'd3';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import { tChartData } from './DataGrouper';

class ScatterPlot {
  container: d3PlotLib.CContainer;

  constructor() {
    this.container = new d3PlotLib.CContainer();
    this.container.addPlot(new d3PlotLib.CScatter());
  }

  update(plotModel: tChartData) {
    const { chartRef, metric, groupedData, columns, colours } = plotModel;

    if (!groupedData) {
      return;
    }

    // visibility array
    const visibilityArr = Array.from(metric.values()).map(
      (elem) => elem.active
    );

    this.container.attrs = {
      ...this.container.attrs,
      html: chartRef,
      xAxisText: {
        ...this.container.attrs.xAxisText,
        rotation: 0,
        onRender: (d) => d,
      },
      onGetXScale: (chartWidth: number) =>
        d3.scaleLinear().domain([0, 200]).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([0, 10]).rangeRound([chartHeight, 0]),
    };

    const scatter = this.container.getPlots()[0];
    scatter.attrs = {
      ...scatter.attrs,
      labels: columns,
      data: Array.from(groupedData.data.values()),
      onSetPlotGroupAttrs: (selection: d3PlotLib.tScatterGroupSelection) => {
        selection
          .style('fill', (_d, ith) => colours[ith])
          .style('visibility', (_d, ith) =>
            visibilityArr[ith] ? 'visible' : 'hidden'
          );
      },
      onGetValue: (d: number) => d,
      colourScale: () => 'blue',
    } as d3PlotLib.tPlotAttrs;

    this.container.update();
  }
}

export { ScatterPlot };
