/* eslint-disable class-methods-use-this */
import { v4 as uuidv4 } from 'uuid';
import { tContainerAttrs } from '../sharedTypes';

class ClipPathGenerator {
  updateSVG(contAttrs: tContainerAttrs) {
    // const { attrs: plotAttrs } = plot;

    const { svg, chartWidth, chartHeight } = contAttrs;
    const { clipPathID } = contAttrs;
    if (!svg) {
      return;
    }

    // eslint-disable-next-line no-param-reassign
    if (!clipPathID) {
      // eslint-disable-next-line no-param-reassign
      contAttrs.clipPathID = `clip-${uuidv4()}`;
    }

    const chartGroup = svg.select('g.chart-group');

    const clipData = chartGroup.select<SVGDefsElement>('defs');
    if (clipData.empty()) {
      chartGroup.append('defs').append('clipPath').append('rect');
    }

    chartGroup
      .select<SVGDefsElement>('defs')
      .select<SVGClipPathElement>('clipPath')
      .attr('id', `${clipPathID}`)
      .select<SVGRectElement>('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', chartWidth)
      .attr('height', chartHeight);
  }
}

export { ClipPathGenerator };
