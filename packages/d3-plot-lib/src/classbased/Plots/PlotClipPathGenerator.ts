/* eslint-disable class-methods-use-this */
import { v4 as uuidv4 } from 'uuid';
import { tContainerAttrs, tPlot } from '../sharedTypes';

class PlotClipPathGenerator {
  updateSVG(plot: tPlot, contAttrs: tContainerAttrs) {
    const { attrs: plotAttrs } = plot;

    const { svg, chartWidth, chartHeight } = contAttrs;
    if (!svg) {
      return;
    }

    // eslint-disable-next-line no-param-reassign
    if (!plotAttrs.clipPathID) {
      plotAttrs.clipPathID = `attrs.plotID-${uuidv4()}`;
    }

    const chartGroup = svg.select('g.chart-group');

    const clipData = chartGroup.select<SVGDefsElement>('defs');
    if (clipData.empty()) {
      chartGroup.append('defs').append('clipPath').append('rect');
    }

    chartGroup
      .select<SVGDefsElement>('defs')
      .select<SVGClipPathElement>('clipPath')
      .attr('id', `${plotAttrs.clipPathID}`)
      .select<SVGRectElement>('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', chartWidth)
      .attr('height', chartHeight);
  }
}

export { PlotClipPathGenerator };
