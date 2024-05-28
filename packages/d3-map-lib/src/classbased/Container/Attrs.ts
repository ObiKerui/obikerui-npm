import { Axis, AxisDomain, AxisScale } from 'd3';

// map: null as L.Map | null,
// div: null as any,
// svg: null as d3.Selection<SVGSVGElement, any, null, undefined> | null,
// width: 500 as number,
// height: 400 as number,
// xScale: null as any,
// yScale: null as any,
// viewType: null as string | null,

// margin: {
//   bottom: 50,
//   left: 40,
//   right: 60,
//   top: 20,
// },

// mapWidth: 0,
// mapHeight: 0,
// showMargins: false,
// projector: null as any,
// zoomer: null as any,
// legend: null as any,
// position: null as any,
// zoom: 10 as number,
// accessToken: null as null | string,

/* eslint-disable @typescript-eslint/no-explicit-any */
const defaultContainerAttrs = {
  html: null as HTMLElement | null,
  svg: null as d3.Selection<SVGSVGElement, any, null, undefined> | null,
  // legend: null as ((_obj: unknown, _plots: unknown) => void) | null,
  showMargins: false,
  height: 500,
  width: 800,
  margins: {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  },
  xAxis: null as Axis<AxisDomain> | null,
  xAxisLabel: 'x axis',
  xAxisShow: true,
  xAxisText: {
    rotation: 0 as number,
  },
  xAxisLabelOffset: 50,
  xScale: null as AxisScale<AxisDomain> | null,
  xAxisLabelEl: null as any,
  xGrid: null as any,
  xGridShow: false,

  yAxis: null as Axis<AxisDomain> | null,
  yAxisShow: true,
  yAxisText: {
    rotation: 0 as number,
  },
  yAxisLabelOffset: -50,
  yAxisLabel: 'y axis',
  yAxisPosition: 'left',
  yScale: null as AxisScale<AxisDomain> | null,
  yAxisLabelEl: null as any,
  yGrid: null as any,
  yGridShow: true,

  chartWidth: 500,
  chartHeight: 500,
  plots: [] as CallableFunction[],

  onGetXScale: null as ((chartWidth: number) => unknown) | null,
  onGetYScale: null as ((chartHeight: number) => unknown) | null,
};

const LeafletMapAttrs = {
  map: null as L.Map | null,
};

const GoogleMapAttrs = {};

const ContainerAttrs = {
  ...defaultContainerAttrs,
  ...LeafletMapAttrs,
  ...GoogleMapAttrs,
};

export { ContainerAttrs };
