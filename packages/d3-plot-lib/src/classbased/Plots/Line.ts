/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import { tContainerAttrs, tScaling } from '../sharedTypes';
import { DataFormatter } from '../../dataFormatter';
import { PlotBase } from './PlotBase';
import { tFill } from './PlotAttrs';

const colorScheme = ['red', 'green', 'blue', 'grey'];

const defaultFill = {
  colour: 'none',
  opacity: 0,
} as tFill;

class CLines extends PlotBase {
  draw(container: tContainerAttrs, { xScale, yScale }: tScaling) {
    const { attrs } = this;
    const { xs, ys, fill } = attrs;
    const { svg } = container;
    const colours = attrs.colours.length > 0 ? attrs.colours : colorScheme;
    const curveType = attrs.curve ?? d3.curveLinear;
    const alpha = [1.0];

    // console.log('in line ftn what is xs/ys? ', ys);

    if (!svg) {
      return;
    }

    const dataFormatter = DataFormatter().xs(xs).ys(ys);
    dataFormatter();
    const xsFormatted = dataFormatter.xsFormatted();
    const ysFormatted = dataFormatter.ysFormatted();

    const chartGroup = svg.select(`.${attrs.plotID}`);

    // select all rect in svg.chart-group with the class bar
    let lines = chartGroup
      .selectAll<SVGPathElement, number>('.lines')
      .data(ysFormatted);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    lines.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroup = lines
      .enter()
      .append('path')
      .classed('lines', true)
      .attr('fill', (_d, ith) => {
        const fillInfo = fill[ith] ?? defaultFill;
        return fillInfo.colour;
      })
      .attr('fill-opacity', (_d, ith) => {
        const fillInfo = fill[ith] ?? defaultFill;
        return fillInfo.opacity;
      })
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5);

    // join the new data points with existing
    lines = lines.merge(enterGroup);

    function definedFtn(d: any) {
      return d >= -0.2;
    }

    function getXValue(_d: any, i: number, _dth: any, ith: number) {
      const ithIndex = ith < xsFormatted.length ? ith : 0;
      const ithX = xsFormatted[ithIndex];
      return ithX[i];
    }

    lines
      .attr('d', (dth, ith) => {
        const line = d3
          .line()
          .defined(definedFtn)
          .curve(curveType)
          .x((d, i) => xScale(getXValue(d, i, dth, ith)) || 0)
          .y((d) => yScale(d) || 0);

        return line(dth as [number, number][]);
      })
      .attr('clip-path', `url(#${attrs.clipPathID})`)
      .attr('stroke', (_d, i) => colours[i] || 'black')
      .style('opacity', (_d, i) => alpha[i] ?? 1);
  }
}

export { CLines };
