import { ContainerAttrs } from './Container/Attrs';
import { tMetadataAttrs } from './Metadata/Attrs';
import { tPlotAttrs } from './Plots/PlotAttrs';

type tContainerAttrs = typeof ContainerAttrs;

type tScaling = {
  xScale: CallableFunction;
  yScale: CallableFunction;
};

type tPlot = {
  attrs: tPlotAttrs;
  update: (atts: tContainerAttrs) => void;
};

type tMetadata = {
  attrs: tMetadataAttrs;
  update: (attrs: tContainerAttrs) => void;
};

export { tContainerAttrs, tPlot, tScaling, tMetadata };
