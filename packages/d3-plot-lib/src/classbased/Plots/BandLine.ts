/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import { tContainerAttrs, tGenericBandScale, tScaling } from '../sharedTypes';
import { PlotBase } from './PlotBase';

class CBandLine extends PlotBase {
  draw(container: tContainerAttrs, { xScale, yScale }: tScaling) {
    const { attrs } = this;
    const { stackedDataset, onGetLabel, onGetValue, labels, alpha } = attrs;

    const { svg, chartHeight } = container;

    if (!svg) {
      return;
    }

    const xd3BarScale = xScale as tGenericBandScale;

    const chartGroup = svg.select(`.${attrs.plotID}`);

    const colourScale = d3
      .scaleOrdinal<string, string>()
      .domain(labels)
      .range(['white']);

    // select all rect in svg.chart-group with the class bar
    let bandSymbols = chartGroup
      .selectAll<SVGCircleElement, number>('.band-circle')
      .data(stackedDataset);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    bandSymbols.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroup = bandSymbols
      .enter()
      .append('circle')
      .classed('band-circle', true);

    // join the new data points with existing
    bandSymbols = bandSymbols.merge(enterGroup);

    bandSymbols
      .attr('cx', (d, i) => {
        const label = onGetLabel ? onGetLabel(d, i) : '';
        return xd3BarScale(label) + xd3BarScale.bandwidth() / 2 ?? 0;
      })
      .attr('cy', (d, i) => {
        const value = onGetValue ? onGetValue(d, i) : 0;
        return yScale(value);
      })
      .attr('r', () => 5)
      .attr('fill', (d) => colourScale(d.key))
      .style('opacity', alpha);

    const lineFtn = d3
      .line<unknown>()
      .curve(d3.curveMonotoneX)
      .x((d, i) => {
        const xValue = onGetLabel ? onGetLabel(d, i) : 0;
        return xd3BarScale(xValue) + xd3BarScale.bandwidth() / 2.0 ?? 0;
      })
      .y((d, i) => {
        const yValue = onGetValue ? onGetValue(d, i) : 0;
        return yScale(yValue);
      });

    // select all rect in svg.chart-group with the class bar
    let bandline = chartGroup
      .selectAll<SVGPathElement, number>('.band-line')
      .data([stackedDataset]);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    bandline.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterLineGroup = bandline
      .enter()
      .append('path')
      .classed('band-line', true);

    // join the new data points with existing
    bandline = bandline.merge(enterLineGroup);

    bandline
      .attr('d', (d) => lineFtn(d))
      .attr('stroke', () => 'black')
      .attr('fill', () => 'none')
      .attr('stroke-width', '4')
      .style('opacity', alpha);
  }
}

export { CBandLine };
