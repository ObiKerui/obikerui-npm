/* eslint-disable max-classes-per-file */
// import * as d3 from 'd3';
// import * as d3PlotLib from '@obikerui/d3-plot-lib';

// export default async function createPlot(ref: HTMLDivElement, data: tEntry[]) {
//   const xElements = d3.set(data.map((item) => item.x)).values();
//   const yElements = d3.set(data.map((item) => item.y)).values();

//   const heatmap = d3PlotLib //
//     .Heatmap()
//     .values(data)
//     .labels(['Alpha', 'Beta', 'Charlie']);

//   const labels = d3PlotLib //
//     .TextPlot()
//     .coordinates([[9600, 90000]])
//     .onGetCoordinates((d: [number, number]) => d)
//     .onGetText(() => '5.5');

//   const markers = d3PlotLib.Markers().xs(['9600']).ys(['90000']);
//   // const legend = d3PlotLib.Legend();

//   const container = d3PlotLib
//     .Container()
//     .xAxisLabel('Annual Rent')
//     .yAxisLabel('Investment')
//     .plot(heatmap)
//     .plot(markers)
//     .plot(labels)
//     // .legend(legend)
//     .onGetXScale((chartWidth: number) =>
//       d3.scaleBand().domain(xElements).rangeRound([0, chartWidth])
//     )
//     .onGetYScale((chartHeight: number) =>
//       d3.scaleBand().domain(yElements).rangeRound([chartHeight, 0])
//     )
//     .html(ref);

//   container();

//   return container;
// }

// function create(ref: HTMLDivElement) {
//   const heatmap = d3PlotLib //
//     .Heatmap()
//     .values([])
//     .labels([]);

//   const labels = d3PlotLib //
//     .TextPlot()
//     .coordinates([]);
//   // .onGetCoordinates((d: [number, number]) => d)
//   // .onGetText(() => '5.5');

//   // const markers = d3PlotLib.Markers().xs(['9600']).ys(['90000']);
//   const markers = d3PlotLib.Markers().xs([]).ys([]);

//   const container = d3PlotLib
//     .Container()
//     .xAxisLabel('Annual Rent')
//     .yAxisLabel('Investment')
//     .plot(heatmap)
//     .plot(markers)
//     .plot(labels)
//     // .legend(legend)
//     .onGetXScale((chartWidth: number) =>
//       d3.scaleBand().domain([]).rangeRound([0, chartWidth])
//     )
//     .onGetYScale((chartHeight: number) =>
//       d3.scaleBand().domain([]).rangeRound([chartHeight, 0])
//     )
//     .html(ref);

//   container();

//   return container;
// }

// function update(container: any, _params: any) {
//   const heatmap = container.plot(0);
//   const markers = container.plot(1);
//   const labels = container.plot(2);

//   const labelData: string[] = [];
//   const heatmapData: tEntry[] = [];
//   const xs: unknown[] = [];
//   const ys: unknown[] = [];
//   const labelCoords: unknown[] = [];
//   // const onGetCoords = (() => );

//   heatmap.values(heatmapData).labels(labelData);
//   labels.coordinates(labelCoords).onGetCoordinates().onGetText();
//   markers.xs(xs).ys(ys);

//   container
//     .onGetXScale((chartWidth: number) =>
//       d3.scaleBand().domain([]).rangeRound([0, chartWidth])
//     )
//     .onGetYScale((chartHeight: number) =>
//       d3.scaleBand().domain([]).rangeRound([chartHeight, 0])
//     );

//   container();
// }

// class PlotModel {
//   rentalIncome: number;
//   rentalCost: number;
//   constructor() {
//     this.rentalIncome = 0;
//     this.rentalCost = 0;
//   }
// }

// class Plots {
//   roiPlot: unknown;
//   constructor() {
//     this.roiPlot = null;
//   }
// }

// class PlotController {
//   notify: (() => void) | null;
//   plots: Plots;
//   model: PlotModel;
//   constructor(ref: HTMLDivElement) {
//     this.notify = null;
//     this.plots = new Plots();
//     this.model = new PlotModel();
//     this.plots.roiPlot = create(ref);
//   }

//   updateRentalIncome(newRentalIncome: number) {
//     const { model } = this;
//     model.rentalIncome = newRentalIncome;
//   }

//   updateRentalCost(newRentalCost: number) {
//     const { model } = this;
//     model.rentalCost = newRentalCost;
//   }

//   update() {
//     const { plots, notify } = this;
//     // update roi plot
//     // plots.roiPlot
//     // plots.roiPlot();

//     if (notify) {
//       notify();
//     }
//   }
// }

// export { PlotController as Plot };
// export type { tEntry };
