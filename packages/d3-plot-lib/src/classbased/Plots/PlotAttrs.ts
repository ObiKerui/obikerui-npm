import * as d3 from 'd3';
import { Series } from 'd3';

/* eslint-disable @typescript-eslint/no-explicit-any */
const defaultPlotAttrs = {
  plotID: null as string | null,
  clipPathID: null as string | null,
  index: 0,
  xs: [] as d3.AxisDomain[],
  ys: [] as d3.AxisDomain[] | d3.AxisDomain[][],
  values: [] as number[],
  alpha: 0,
  labels: [] as string[],
  colours: [] as string[],
  colourScale: null as unknown,
  curve: null as d3.CurveFactory | null,
  tag: null as string | null,
  lineStyles: null as string[] | null,
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

const PlotAttrs = {
  ...defaultPlotAttrs,
  ...HistogramAttrs,
  ...FillAttrs,
  ...GroupedBarAttrs,
  ...stackedAttrs,
};

export default PlotAttrs;
type tPlotAttrs = typeof PlotAttrs;
export type { tPlotAttrs, tConditionParam };
