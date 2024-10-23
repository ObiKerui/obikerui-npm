// import { atom } from 'jotai';
import * as d3 from 'd3';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import { MetricMap, tModel } from './Model';

// FIRST ATTEMPT TO STRATIFY DATA
// const grouped = d3.group(data.flatMap(Object.entries), ([key]) => key);
// const grouped = d3Array.group(csvresult, (obj) => obj.species);
// console.log('what is the csv result: ', csvresult);
// console.log('what is the grouped result: ', grouped);

// Step 1: Group by key (a or c), and map the results to arrays of values.
// const groupeda = d3Array.group(
//   csvresult.flatMap(Object.entries),
//   ([key]) => key
// );

// Step 2: Transform the grouped data into the desired format.
// const transformed = Array.from(groupeda, ([key, entries]) => ({
//   [key]: entries.map(([, value]) => value),
// }));

function stratify(arr: object[], keys: string[]) {
  const map = new Map<string, unknown[]>();

  // Initialize each key with an empty array
  keys.forEach((key) => {
    map.set(key, Array(arr.length).fill(0));
  });

  arr.forEach((elem, ith) => {
    const objKeys = Object.keys(elem);
    objKeys.forEach((k) => {
      const arrElem = map.get(k);
      if (arrElem) arrElem[ith] = elem[k as keyof typeof elem];
    });
  });

  return map;
}

class ScatterPlot {
  container: d3PlotLib.CContainer;

  constructor() {
    this.container = new d3PlotLib.CContainer();
    this.container.addPlot(new d3PlotLib.CScatter());
  }

  update(plotModel: tModel) {
    const { chartRef, metric, processedData, colours, species } = plotModel;

    // visibility array
    const visibilityArr = Array.from(metric.values()).map(
      (elem) => elem.active
    );

    const filtered = processedData.filter(
      (elem) => species.get(elem.species)?.active ?? false
    );

    const stratified = stratify(filtered, Array.from(MetricMap.keys()));
    const arrayOfArrays = Array.from(stratified, ([, values]) => values);

    this.container.attrs = {
      ...this.container.attrs,
      html: chartRef,
      xAxisText: {
        ...this.container.attrs.xAxisText,
        rotation: 0,
        onRender: (d) => d,
      },
      yAxisProperties: this.container.axisLayout.middleYAxisLabel('y values'),
      onGetXScale: (chartWidth: number) =>
        d3.scaleLinear().domain([0, 200]).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([0, 10]).rangeRound([chartHeight, 0]),
    };

    const scatter = this.container.getPlots()[0];
    scatter.attrs = {
      ...scatter.attrs,
      ys: arrayOfArrays,
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
