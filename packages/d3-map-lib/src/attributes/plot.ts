const plotAttributes = {
  plotID: null as string | null,
  index: 0,
  xs: [] as d3.AxisDomain[],
  ys: [] as d3.AxisDomain[] | d3.AxisDomain[][],
  alpha: 0,
  labels: [] as string[],
  colours: [] as string[],
};

export default plotAttributes;
export type tPlotAttrs = typeof plotAttributes;
