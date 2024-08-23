// import * as d3PlotLib from '@obikerui/d3-plot-lib';
// import * as d3 from 'd3';
// import { create } from 'zustand';
// import dayjs from 'dayjs';
// import { tPowerCategory } from '../../Solax/Types';

// class Chart {
//   container;
//   constructor() {
//     this.container = new d3PlotLib.CContainer();
//     this.container.addPlot(new d3PlotLib.CBar());
//   }

//   //   getMinMax(category: tPowerCategory) {
//   //     switch (category) {
//   //       case 'consumption':
//   //         return [0, 5000];
//   //       case 'dailyYield':
//   //         return [0, 400];
//   //       case 'feedInEnergy':
//   //         return [0, 5000];
//   //       case 'soc':
//   //         return [0, 100];
//   //       default:
//   //         return [0, 0];
//   //     }
//   //   }

//   update(newModel: tBatteryChart) {
//     const { container, categories, rangedData } = newModel;

//     if (!rangedData) {
//       return;
//     }

//     // const extent = d3.extent(
//     //   rangedData,
//     //   (elem) => dayjs(elem.uploadTime).toDate() as Date
//     // );

//     // const validExtent = [extent[0] ?? new Date(), extent[1] ?? new Date()] as [
//     //   Date,
//     //   Date
//     // ];

//     // const ys = rangedData.map((elem) => elem.soc);
//     // const xs = rangedData.map((elem) => dayjs(elem.uploadTime).toDate());

//     this.container.attrs = {
//       ...this.container.attrs,
//       html: container,
//       width: 500,
//       height: 400,
//       yAxisLabel: categories[0] ?? '',
//       xAxisText: {
//         rotation: 45,
//         onRender: () => '',
//       },
//       onGetXScale: (chartWidth: number) =>
//         d3
//           .scaleBand()
//           .domain(['labels'])
//           .padding(3)
//           .rangeRound([0, chartWidth]),
//       onGetYScale: (chartHeight: number) =>
//         d3.scaleLinear().domain([0, 100]).rangeRound([chartHeight, 0]),
//     } as d3PlotLib.tContainerAttrs;

//     const plot = this.container.getPlots()[0];
//     plot.attrs = {
//       ...plot.attrs,
//     } as d3PlotLib.tPlotAttrs;

//     this.container.update();
//   }
// }

// // const chart = new Chart();

// // useBatteryChart.subscribe((newModel) => {
// //   chart.update(newModel);
// // });
