/* eslint-disable import/no-extraneous-dependencies */
import * as d3 from 'd3';
import * as d3PlotLib from 'd3-plot-lib';

export default async function createPlot(ref: HTMLDivElement, data: unknown[]) {
  const [xs, bars, _yLineData] = data;

  const scaler = d3PlotLib
    .Scaler()
    .xScaleCallback((_xs: d3.AxisDomain[][], chartWidth: number) => {
      const flatXs = _xs.flat() as string[];

      return d3
        .scaleBand()
        .domain(flatXs)
        .padding(0.1)
        .rangeRound([0, chartWidth]) as d3.AxisScale<d3.AxisDomain>;
    })
    .yScaleCallback((ys: d3.AxisDomain[][], chartHeight: number) => {
      const flatYs = ys.flat() as number[];
      const extent = d3.extent(flatYs);

      if (!extent[0]) {
        return null;
      }

      return d3
        .scaleLinear()
        .domain([0, +extent[1] + 1])
        .rangeRound([chartHeight, 0]);
    });

  const hist = d3PlotLib //
    .BarPlot()
    .xs(xs)
    .alpha([0.8])
    .ys(bars)
    .labels(['Profit']);

  //   const yLines = demoChart.AyLine().ys(yLineData)

  const legend = d3PlotLib.Legend();

  const container = d3PlotLib
    .Container()
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(hist)
    // .plot(yLines)
    .legend(legend);

  d3.select(ref).call(container);

  return container;
}
