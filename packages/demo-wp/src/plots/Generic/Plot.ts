// import { atom } from 'jotai';
import * as d3 from 'd3';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import { tModel, tMetric, tData } from './Model';

class Plot {
  container: d3PlotLib.CContainer;

  constructor() {
    this.container = new d3PlotLib.CContainer();
    this.container.addPlot(new d3PlotLib.CGeneric());
  }

  getMetric(metric: tMetric, data: tData) {
    switch (metric) {
      case 'Avg Consumption':
        return data.consumption;
      case 'Avg Export':
        return data.export;
      case 'Avg Price Per KwH':
        return data.ppkwh;
      default:
        return 0;
    }
  }

  update(barPlotModel: tModel) {
    const { getMetric } = this;
    const { chartRef, groupedData, metric } = barPlotModel;

    if (!groupedData) {
      return;
    }

    const labels = groupedData.map((elem) => elem.date);

    this.container.attrs = {
      ...this.container.attrs,
      html: chartRef,
      xAxisText: {
        ...this.container.attrs.xAxisText,
        rotation: 45,
        onRender: (d) => d,
      },
      yAxisProperties: this.container.axisLayout.middleYAxisLabel('y values'),
      onGetXScale: (chartWidth: number) =>
        d3
          .scaleBand()
          .domain(labels)
          .paddingInner(0.1)
          .rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([0, 20]).rangeRound([chartHeight, 0]),
    };

    const bars = this.container.getPlots()[0] as d3PlotLib.CGeneric;
    bars.genericAttrs = {
      onDraw: (
        selection: d3PlotLib.tSelection,
        scaling: d3PlotLib.tScaling,
        chartHeight
      ) => {
        const xScale = scaling.xScale as d3PlotLib.tGenericBandScale;

        // select all rect in svg.chart-group with the class bar
        let barsElems = selection
          .selectAll<SVGRectElement, number>('.bar')
          .data(groupedData ?? []);

        // Exit - remove data points if current data.length < data.length last time this ftn was called
        barsElems.exit().style('opacity', 0).remove();

        // Enter - add the shapes to this data point
        const enterGroup = barsElems
          .enter()
          .append('rect')
          .classed('bar', true);

        // join the new data points with existing
        barsElems = barsElems.merge(enterGroup);

        barsElems
          .attr('x', (d) => xScale(d.date) ?? 0)
          .attr('y', (d) => scaling.yScale(getMetric(metric, d)) ?? 0)
          .attr('width', xScale.bandwidth())
          .attr(
            'height',
            (d) => chartHeight - scaling.yScale(getMetric(metric, d))
          )
          .attr('fill', 'red')
          .style('opacity', 1);
      },
    } as d3PlotLib.CGeneric['genericAttrs'];

    this.container.update();
  }
}

export { Plot };
export { tData, tModel };
