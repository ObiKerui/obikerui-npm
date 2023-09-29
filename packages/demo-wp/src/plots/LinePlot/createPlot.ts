import * as d3 from 'd3';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import { flatten } from '../../Utils/Utils';

export default async function createPlot(ref: HTMLDivElement, data: unknown[]) {
  const [xs, ys] = data;

  const lines = d3PlotLib //
    .Line()
    .xs(xs)
    // .alpha([0.8])
    .ys(ys)
    .labels(['Alpha', 'Beta', 'Charlie']);

  //   const yLines = demoChart.AyLine().ys(yLineData)

  const legend = d3PlotLib.Legend();

  const container = d3PlotLib
    .Container()
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .plot(lines)
    .legend(legend)
    .onGetXScale((chartWidth: number) => {
      const extent = d3.extent(xs as number[]) as [number, number];
      return d3
        .scaleLinear()
        .domain(extent[0] ? extent : [0, 0])
        .rangeRound([0, chartWidth]);
    })
    .onGetYScale((chartHeight: number) => {
      const extent = d3.extent(flatten(ys as number[][])) as [number, number];
      return d3
        .scaleLinear()
        .domain([0, +extent[1] + 1])
        .rangeRound([chartHeight, 0]);
    });

  d3.select(ref).call(container);

  return container;
}
