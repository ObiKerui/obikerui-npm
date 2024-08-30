/* eslint-disable class-methods-use-this */
import { tContainerAttrs, tGenericD3Scale, tPlot } from '../sharedTypes';

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
      xScale = getPlotXScale(chartWidth) as tGenericD3Scale;
    }
    if (!xScale && getContainerXScale) {
      xScale = getContainerXScale(chartWidth) as tGenericD3Scale;
    }

    let yScale = null;
    if (getPlotYScale) {
      yScale = getPlotYScale(chartHeight) as tGenericD3Scale;
    }
    if (!yScale && getContainerYScale) {
      yScale = getContainerYScale(chartHeight) as tGenericD3Scale;
    }

    return {
      xScale,
      yScale,
    };
  }
}

export { PlotScalesGenerator };
