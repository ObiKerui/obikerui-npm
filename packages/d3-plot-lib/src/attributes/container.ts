/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axis, AxisDomain, AxisScale } from 'd3';

const ContainerAttrs = {
  svg: null as d3.Selection<SVGSVGElement, any, null, undefined> | null,
  scale: (_obj: unknown, _plots: unknown): void => {},
  legend: (_obj: unknown, _plots: unknown): void => {},
  showMargins: true,
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

export default ContainerAttrs;
export type tContainerAttrs = typeof ContainerAttrs;
