import * as d3 from 'd3';
import * as d3SolarLib from 'd3-solar-lib';

export default async function createPlot(ref: HTMLDivElement, data: unknown[]) {
  const [xs, ys] = data;

  const scaler = d3SolarLib
    .Scaler()
    .xScaleCallback((_xs: d3.AxisDomain[][], chartWidth: number) => {
      const flatXs = _xs.flat() as number[];
      const extent = d3.extent(flatXs);

      // if (!extent[0]) {
      //   return null;
      // }

      return d3
        .scaleLinear()
        .domain(extent[0] ? extent : [0, 0])
        .rangeRound([0, chartWidth]) as d3.AxisScale<d3.AxisDomain>;
    })
    .yScaleCallback((_ys: d3.AxisDomain[][], chartHeight: number) => {
      const flatYs = _ys.flat() as number[];
      const extent = d3.extent(flatYs);

      if (!extent[0]) {
        return null;
      }

      return d3.scaleLinear().domain([0, +extent[1]]).rangeRound([chartHeight, 0]);
    });

  const hist = d3SolarLib //
    .Analemma()
    .xs(xs)
    .ys([ys])
    .labels(['Profit']);

  const legend = d3SolarLib.Legend();

  const container = d3SolarLib
    .Container()
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(hist)
    .legend(legend);

  d3.select(ref).call(container);

  return container;
}
