const defaultPlotAttrs = {
  plotID: null as string | null,
  index: 0 as number,
  clipPathID: null as string | null,
  geojson: null as unknown,
  json: [] as unknown,
  style: null as string | null,
};

const MarkerAttrs = {
  onDrawMarker: null as ((data: unknown, index: number) => string) | null,
};

const PlotAttrs = {
  ...defaultPlotAttrs,
  ...MarkerAttrs,
};

type tPlotAttrs = typeof PlotAttrs;
export type { tPlotAttrs };
export { PlotAttrs };
