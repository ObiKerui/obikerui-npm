/* eslint-disable class-methods-use-this */
import { tContainerAttrs, tPlot } from '../sharedTypes';

class PlotScalesGenerator {
  updateScales(plot: tPlot, contAttrs: tContainerAttrs) {
    const { attrs: plotAttrs } = plot;
    const { onGetXScale: getPlotXScale, onGetYScale: getPlotYScale } =
      plotAttrs;
    const {
      onGetXScale: getContainerXScale,
      onGetYScale: getContainerYScale,
      chartWidth,
      chartHeight,
    } = contAttrs;

    let xScale = null;
    if (getPlotXScale) {
      xScale = getPlotXScale(chartWidth) as CallableFunction;
    }
    if (!xScale && getContainerXScale) {
      xScale = getContainerXScale(chartWidth) as CallableFunction;
    }

    let yScale = null;
    if (getPlotYScale) {
      yScale = getPlotYScale(chartHeight) as CallableFunction;
    }
    if (!yScale && getContainerYScale) {
      yScale = getContainerYScale(chartHeight) as CallableFunction;
    }

    return {
      xScale,
      yScale,
    };
  }
}

export { PlotScalesGenerator };
