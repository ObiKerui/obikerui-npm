import * as d3 from 'd3';
import { Series } from 'd3';

type tLineAttrs = {
  stroke?: string;
  strokeOpacity?: number;
  fillColour?: string;
  fillOpacity?: number;
  opacity?: number;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const defaultPlotAttrs = {
  plotID: null as string | null,
  clipPathID: null as string | null,
  index: 0,
  xs: [] as d3.AxisDomain[],
  // ys: [] as d3.AxisDomain[] | d3.AxisDomain[][],
  ys: [] as d3.AxisDomain[][],
  values: [] as number[],
  alpha: 1,
  labels: [] as string[],
  colours: [] as string[],
  opacity: [] as number[],
  colourScale: null as unknown,
  curve: null as d3.CurveFactory | null,
  tag: null as string | null,
  lineStyles: null as string[] | null,
  lineAttrs: [] as tLineAttrs[],
  data: null as any,
  onClick: null as any,
  onMouseDown: null as any,
  onMouseUp: null as any,
  onEnter: null as any,
  onLeave: null as any,
  onMove: null as any,
  coordinates: [] as unknown[],
  onGetCoordinates: null as ((data: unknown) => [number, number]) | null,
  onGetText: null as ((data: unknown) => string) | null,
  onSetAttrs: null as ((data: unknown) => string) | null,
  onGetXScale: null as ((chartWidth: number) => unknown) | null,
  onGetYScale: null as ((chartHeight: number) => unknown) | null,
  onGetColourScale: null as (() => CallableFunction) | null,
};

type tScatterGroupSelection = d3.Selection<
  SVGGElement,
  unknown,
  d3.BaseType,
  any
>;

const ScatterAttrs = {
  onGetX: null as ((data: unknown, ith: number) => d3.AxisDomain) | null,
  onGetY: null as ((data: unknown, ith: number) => d3.AxisDomain) | null,
  onSetPlotGroupAttrs: null as
    | ((selection: tScatterGroupSelection) => void)
    | null,
};

const BarAttrs = {
  onGetLabel: null as ((data: unknown, ith: number) => string) | null,
  onGetValue: null as ((data: unknown, ith: number) => number) | null,
};

const HistogramAttrs = {
  bins: 0 as number,
  normlise: false as boolean,
  useDensity: false as boolean,
};

type tConditionParam = number | string;

const FillAttrs = {
  where: null as ((x: tConditionParam) => boolean) | null,
};

const GroupedBarAttrs = {
  subgroups: [] as string[],
};

const stackedAttrs = {
  stackedDataset: [] as Series<
    {
      [key: string]: number;
    },
    string
  >[],
};

const StackedAreaAttrs = {
  onGetY0: null as null | CallableFunction,
  onGetY1: null as null | CallableFunction,
};

const BrushAttrs = {
  timeFrame: [0, 0] as [d3.NumberValue, d3.NumberValue],
};

const PlotAttrs = {
  ...defaultPlotAttrs,
  ...ScatterAttrs,
  ...BarAttrs,
  ...HistogramAttrs,
  ...FillAttrs,
  ...GroupedBarAttrs,
  ...stackedAttrs,
  ...StackedAreaAttrs,
  ...BrushAttrs,
};

export default PlotAttrs;
type tPlotAttrs = typeof PlotAttrs;
export type { tPlotAttrs, tConditionParam, tScatterGroupSelection, tLineAttrs };
