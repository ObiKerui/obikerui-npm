/* eslint-disable @typescript-eslint/no-explicit-any */
type tLegendPosition = 'topleft' | 'topright' | 'bottomleft' | 'bottomright';

const defaultMetadataAttrs = {
  metadataID: null as string | null,
  clipPathID: null as string | null,
  index: 0,
  position: 'topleft' as tLegendPosition,
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

const LegendAttrs = {};

const MetadataAttrs = {
  ...defaultMetadataAttrs,
  ...LegendAttrs,
};

export default MetadataAttrs;
type tMetadataAttrs = typeof MetadataAttrs;
export type { tMetadataAttrs };
