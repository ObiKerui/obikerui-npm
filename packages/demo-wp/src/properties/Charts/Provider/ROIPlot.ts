/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import * as d3PlotLib from '@obikerui/d3-plot-lib';
import { PlotModel } from './Model';

class ROIPlot {
  container: d3PlotLib.CContainer;
  ref: HTMLDivElement | null;
  constructor() {
    this.ref = null;

    const container = new d3PlotLib.CContainer();
    container.addPlot(new d3PlotLib.CHeatmap());
    container.addPlot(new d3PlotLib.CMarkers());
    container.addPlot(new d3PlotLib.CText());

    const newContAttrs = {
      ...container.attrs,
      onGetXScale: (chartWidth: number) =>
        d3.scaleBand().domain([]).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleBand().domain([]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tContainerAttrs;

    container.attrs = newContAttrs;
    container.update();
    this.container = container;
  }

  update(model: PlotModel) {
    const { container } = this;
    const { pageElements, roiPlot, yieldData } = model;

    const xElements = d3.set(yieldData.entries.map((item) => item.x)).values();
    const yElements = d3.set(yieldData.entries.map((item) => item.y)).values();

    const xMarkers = yieldData.markers.map((item) => item.x);
    const yMarkers = yieldData.markers.map((item) => item.y);

    type tCoord = {
      x: number;
      y: number;
      value: string;
    };

    const textCoords = yieldData.markers.map(
      (item) =>
        ({
          x: item.x,
          y: item.y,
          value: `${item.value.toFixed(1)}%`,
        } as tCoord)
    );

    container.attrs = {
      ...container.attrs,
      html: pageElements.roiPlotDiv,
      xAxisLabel: roiPlot.xAxisTitle,
      yAxisLabel: roiPlot.yAxisTitle,
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
      values: yieldData.entries,
      labels: [],
      onGetColourScale: colorScale,
    } as d3PlotLib.tPlotAttrs;

    const markers = container.plots[1];
    markers.attrs = {
      ...markers.attrs,
      xs: xMarkers,
      ys: yMarkers,
      colours: ['black', 'green'],
      onGetXScale: (chartWidth: number) =>
        d3.scaleLinear().domain([-50, 1950]).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([45000, 195000]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tPlotAttrs;

    const labels = container.plots[2];
    labels.attrs = {
      ...labels.attrs,
      coordinates: textCoords,
      onGetCoordinates: (elem: tCoord) => [elem.x + 80, elem.y],
      onGetText: (elem: tCoord) => elem.value,
      onGetXScale: (chartWidth: number) =>
        d3.scaleLinear().domain([-50, 1950]).rangeRound([0, chartWidth]),
      onGetYScale: (chartHeight: number) =>
        d3.scaleLinear().domain([45000, 195000]).rangeRound([chartHeight, 0]),
    } as d3PlotLib.tPlotAttrs;

    container.update();
    console.log('updated the container...');
  }
}

export { ROIPlot };
