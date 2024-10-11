/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import { tModel } from './Model';

class Plot {
  container: d3PlotLib.CContainer;
  ref: HTMLDivElement | null;
  constructor() {
    this.ref = null;

    const container = new d3PlotLib.CContainer();
    container.addPlot(new d3PlotLib.CHeatmap());
    container.addPlot(new d3PlotLib.CMarkers());
    container.addPlot(new d3PlotLib.CText());

    container.addPlot(new d3PlotLib.CMarkers());
    container.addPlot(new d3PlotLib.CText());

    const newContAttrs = {
      ...container.attrs,
      width: 500,
      onGetXScale: (chartWidth: number) =>
        d3.scaleBand().domain([]).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleBand().domain([]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tContainerAttrs;

    container.attrs = newContAttrs;
    this.container = container;
  }

  update(model: tModel) {
    const { container } = this;
    const {
      roiContainer,
      yieldValues,
      properties,
      testInvestment,
      testRentalCost,
      testRentalIncome,
    } = model;

    const xElements = yieldValues.map((elem) => `${elem.balance}`);
    const yElements = yieldValues.map((elem) => `${elem.investment}`);

    const xMarkers = properties.map((elem) => elem.balance);
    const yMarkers = properties.map((elem) => elem.investment);

    const xTestMarkers = [testRentalIncome - testRentalCost];
    const yTestMarkers = [testInvestment];

    // xMarkers.push(testRentalIncome - testRentalCost);
    // yMarkers.push(testInvestment);

    type tCoord = {
      x: number;
      y: number;
      value: string;
    };

    const textCoords = properties.map(
      (item) =>
        ({
          x: item.balance,
          y: item.investment,
          value: `${item.yieldValue.toFixed(1)}%`,
        } as tCoord)
    );

    const testTextCoords = [
      {
        x: testRentalIncome - testRentalCost,
        y: testInvestment,
        value: '5',
      },
    ];

    console.log(
      'updated roi plot model: ',
      properties,
      xMarkers,
      yMarkers,
      textCoords
    );

    container.attrs = {
      ...container.attrs,
      chartWidth: 100,
      html: roiContainer,
      xAxisLabel: 'cashflow',
      yAxisLabel: 'property value',
      onGetXScale: (chartWidth: number) =>
        d3.scaleBand().domain(xElements).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleBand().domain(yElements).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tContainerAttrs;

    const colorScale = () => (value: number) => {
      if (value < 3) return 'rgba(255, 0, 0, 0.5)';
      if (value < 5) return 'rgba(128, 255, 0, 0.5)';
      return 'rgba(128, 255, 200, 0.5)';
    };

    const heatmap = container.plots[0];
    heatmap.attrs = {
      ...heatmap.attrs,
      values: yieldValues.map((elem) => ({
        x: elem.balance,
        y: elem.investment,
        v: elem.yieldValue,
      })),
      labels: [],
      onGetColourScale: colorScale,
    } as d3PlotLib.tPlotAttrs;

    const savedPropertyMarkers = container.plots[1];
    savedPropertyMarkers.attrs = {
      ...savedPropertyMarkers.attrs,
      xs: xMarkers,
      ys: yMarkers,
      colours: ['black', 'blue', 'purple'],
      onGetXScale: (chartWidth: number) =>
        d3.scaleLinear().domain([-50, 1950]).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([45000, 195000]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tPlotAttrs;

    const savedPropertyLabels = container.plots[2];
    savedPropertyLabels.attrs = {
      ...savedPropertyLabels.attrs,
      coordinates: textCoords,
      onGetCoordinates: (elem: tCoord) => [elem.x + 80, elem.y],
      onGetText: (elem: tCoord) => elem.value,
      onGetXScale: (chartWidth: number) =>
        d3.scaleLinear().domain([-50, 1950]).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([45000, 195000]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tPlotAttrs;

    const testPropertyMarkers = container.plots[3];
    testPropertyMarkers.attrs = {
      ...testPropertyMarkers.attrs,
      xs: xTestMarkers,
      ys: yTestMarkers,
      colours: ['green'],
      onGetXScale: (chartWidth: number) =>
        d3.scaleLinear().domain([-50, 1950]).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([45000, 195000]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tPlotAttrs;

    const testPropertyLabels = container.plots[4];
    testPropertyLabels.attrs = {
      ...testPropertyLabels.attrs,
      coordinates: testTextCoords,
      onGetCoordinates: (elem: tCoord) => [elem.x + 80, elem.y],
      onGetText: (elem: tCoord) => elem.value,
      onGetXScale: (chartWidth: number) =>
        d3.scaleLinear().domain([-50, 1950]).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([45000, 195000]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tPlotAttrs;

    container.update();
  }
}

export default Plot;
