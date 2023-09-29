/* eslint-disable import/no-extraneous-dependencies */
import * as d3 from 'd3';
import * as d3PlotLib from '@obikerui/d3-plot-lib';

export default async function createPlot(ref: HTMLDivElement, data: unknown[]) {
  const [xs, bars, _yLineData] = data;

  const hist = d3PlotLib //
    .BarPlot()
    .xs(xs)
    .alpha([0.8])
    .ys(bars)
    .labels(['Profit']);

  // const yLines = demoChart.AyLine().ys(yLineData)

  const legend = d3PlotLib.Legend();

  const container = d3PlotLib
    .Container()
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .plot(hist)
    .legend(legend)
    .onGetXScale((chartWidth: number) =>
      d3
        .scaleBand()
        .domain(xs as string[])
        .padding(0.1)
        .rangeRound([0, chartWidth])
    )
    .onGetYScale((chartHeight: number) => {
      const extent = d3.extent(bars as number[]) as [number, number];
      return d3
        .scaleLinear()
        .domain([0, +extent[1] + 1])
        .rangeRound([chartHeight, 0]);
    });

  d3.select(ref).call(container);

  return container;
}
