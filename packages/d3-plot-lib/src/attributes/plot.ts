/* eslint-disable @typescript-eslint/no-explicit-any */
const plotAttributes = {
  plotID: null as string | null,
  clipPathID: null as string | null,
  index: 0,
  xs: [] as d3.AxisDomain[],
  ys: [] as d3.AxisDomain[] | d3.AxisDomain[][],
  alpha: 0,
  labels: [] as string[],
  colours: [] as string[],
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
};

export default plotAttributes;
export type tPlotAttrs = typeof plotAttributes;
