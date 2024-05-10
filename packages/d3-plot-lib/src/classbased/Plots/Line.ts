/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid';
import { tContainerAttrs, tScaling } from '../sharedTypes';
import { DataFormatter } from '../../dataFormatter';
import { PlotBase } from './PlotBase';

const colorScheme = ['red', 'green', 'blue', 'grey'];

class CLines extends PlotBase {
  draw(container: tContainerAttrs, { xScale, yScale }: tScaling) {
    const { attrs } = this;
    const { xs, ys } = attrs;
    const { svg, chartHeight, chartWidth } = container;
    const colours = attrs.colours.length > 0 ? attrs.colours : colorScheme;
    const curveType = attrs.curve ?? d3.curveLinear;
    const alpha = [1.0];

    // console.log('in line ftn what is xs/ys? ', xs, ys);

    if (!svg) {
      return;
    }

    const dataFormatter = DataFormatter().xs(xs).ys(ys);
    dataFormatter();
    const xsFormatted = dataFormatter.xsFormatted();
    const ysFormatted = dataFormatter.ysFormatted();

    const chartGroup = svg.select(`.${attrs.plotID}`);

    // try adding a clip path to the svg
    attrs.clipPathID = `attrs.plotID-${uuidv4()}`;
    chartGroup
      .append('defs')
      .append('clipPath')
      .attr('id', `${attrs.clipPathID}`)
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', chartWidth) // Adjust the width as needed
      .attr('height', chartHeight); // Adjust the height as needed

    // select all rect in svg.chart-group with the class bar
    let lines = chartGroup.selectAll('.lines').data(ysFormatted);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    lines.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroup = lines
      .enter()
      .append('path')
      .classed('lines', true)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5);

    // join the new data points with existing
    lines = lines.merge(enterGroup as any);

    function definedFtn(d: any) {
      return d >= -0.2;
    }

    function getXValue(_d: any, i: number, _dth: any, ith: number) {
      const ithIndex = ith < xsFormatted.length ? ith : 0;
      const ithX = xsFormatted[ithIndex];
      return ithX[i];
    }

    lines
      .attr('d', (dth: any, ith: number) => {
        const line = d3
          .line()
          .defined(definedFtn)
          .curve(curveType)
          .x((d: any, i: number) => xScale(getXValue(d, i, dth, ith)) || 0)
          .y((d: any) => yScale(d) || 0);

        return line(dth);
      })
      .attr('clip-path', `url(#${attrs.clipPathID})`)
      .attr('stroke', (_d: any, i: number) => colours[i] || 'black')
      .style(
        'opacity',
        (_d: any, i: number) =>
          // console.log('alpha / d / i ', alpha, d, i)
          alpha[i] ?? 1
      );
  }
}

export { CLines };
