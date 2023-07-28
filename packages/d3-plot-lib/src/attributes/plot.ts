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
};

export default plotAttributes;
export type tPlotAttrs = typeof plotAttributes;
