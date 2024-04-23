import * as d3 from 'd3';
import * as d3PlotLib from '@obikerui/d3-plot-lib';

type tEntry = {
  x: number;
  y: number;
  v: number;
};

export default async function createPlot(ref: HTMLDivElement, data: tEntry[]) {
  const xElements = d3.set(data.map((item) => item.x)).values();
  const yElements = d3.set(data.map((item) => item.y)).values();
  // const vElements = d3.set(data.map((item) => item.v)).values();

  // console.log('domain of x elements: ', xElements);

  const heatmap = d3PlotLib //
    .Heatmap()
    .values(data)
    .labels(['Alpha', 'Beta', 'Charlie']);

  const markers = d3PlotLib.Markers().xs(['9600']).ys(['90000']);
  // const legend = d3PlotLib.Legend();

  const container = d3PlotLib
    .Container()
    .xAxisLabel('Annual Rent')
    .yAxisLabel('Investment')
    .plot(heatmap)
    .plot(markers)
    // .legend(legend)
    .onGetXScale((chartWidth: number) =>
      d3.scaleBand().domain(xElements).rangeRound([0, chartWidth])
    )
    .onGetYScale((chartHeight: number) =>
      d3.scaleBand().domain(yElements).rangeRound([chartHeight, 0])
    )
    .html(ref);

  container();

  return container;
}

export type { tEntry };
