/* eslint-disable class-methods-use-this */
import { tContainerAttrs, tPlot } from '../sharedTypes';

class PlotSVGGenerator {
  updateSVG(plot: tPlot, contAttrs: tContainerAttrs) {
    const { attrs: plotAttrs } = plot;

    const { svg } = contAttrs;
    if (!svg) {
      return;
    }

    const chartGroup = svg.select('g.chart-group');
    const children = chartGroup.selectAll('*');
    const existingElements = children.filter(`g.${plotAttrs.plotID}`);

    if (existingElements.size() > 0) {
      return;
    }

    plotAttrs.index = children.size();
    plotAttrs.plotID = `plot-${plotAttrs.index}`;
    // plotAttrs.clipPathID = plotAttrs.plotID;
    chartGroup.append('g').classed(`${plotAttrs.plotID}`, true);
  }
}

export { PlotSVGGenerator };
