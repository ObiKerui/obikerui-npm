import { Axis, AxisDomain, AxisScale } from 'd3';

type tYAxisLabelProps = {
  offset: [number, number];
  textAnchor: 'start' | 'middle' | 'end';
  rotation: number;
  yValuesRotation: number;
  text: string;
  visible: boolean;
  onRender: ((d: unknown, ith: number) => unknown) | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const ContainerAttrs = {
  html: null as HTMLElement | null,
  svg: null as d3.Selection<SVGSVGElement, any, null, undefined> | null,
  display: 'block' as 'block' | 'inline' | 'none',
  clipPathID: null as string | null,
  legend: null as ((_obj: unknown, _plots: unknown) => void) | null,
  showMargins: false,
  height: 500,
  width: 800,
  margins: {
    top: 10,
    left: 80,
    right: 10,
    bottom: 80,
  },
  xAxis: null as Axis<AxisDomain> | null,
  xAxisLabel: 'x axis',
  xAxisShow: true,
  xAxisText: {
    rotation: 0 as number,
    onRender: null as ((d: unknown, ith: number) => unknown) | null,
  },
  xAxisLabelOffset: 50,
  xScale: null as AxisScale<AxisDomain> | null,
  xAxisLabelEl: null as any,
  xGrid: null as any,
  xGridShow: false,

  yAxis: null as Axis<AxisDomain> | null,
  yAxisProperties: {
    offset: [0, 0],
    visible: true,
    textAnchor: 'middle',
    rotation: 0,
    yValuesRotation: 0,
    text: 'Y Axis',
    onRender: null,
  } as tYAxisLabelProps,
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

export { ContainerAttrs };
export type { tYAxisLabelProps };
