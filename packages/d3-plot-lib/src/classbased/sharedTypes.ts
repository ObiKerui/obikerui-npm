import { AxisDomain } from 'd3';
import { ContainerAttrs } from './Container/Attrs';
import { tMetadataAttrs } from './Metadata/Attrs';
import { tPlotAttrs } from './Plots/PlotAttrs';

type tContainerAttrs = typeof ContainerAttrs;

type tGenericD3Scale = CallableFunction & {
  domain: () => ArrayLike<AxisDomain>;
  range: () => ArrayLike<AxisDomain>;
};

type tGenericBandScale = tGenericD3Scale & {
  bandwidth: () => number;
};

type tScaling = {
  xScale: tGenericD3Scale;
  yScale: tGenericD3Scale;
};

type tPlot = {
  attrs: tPlotAttrs;
  update: (atts: tContainerAttrs) => void;
};

type tMetadata = {
  attrs: tMetadataAttrs;
  update: (attrs: tContainerAttrs) => void;
};

export {
  tGenericD3Scale,
  tGenericBandScale,
  tContainerAttrs,
  tPlot,
  tScaling,
  tMetadata,
};
