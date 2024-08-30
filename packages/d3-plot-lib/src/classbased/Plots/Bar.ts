/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import { tContainerAttrs, tGenericBandScale, tScaling } from '../sharedTypes';
import { PlotBase } from './PlotBase';

const defaultFill = {
  fillOpacity: 1,
  fillColour: 'none',
  stroke: 'black',
  strokeOpacity: 1,
  opacity: 1,
};

class CBar extends PlotBase {
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
      .range(['blue', 'red', 'green']);

    // select all rect in svg.chart-group with the class bar
    let bars = chartGroup
      .selectAll<SVGRectElement, number>('.bar')
      .data(stackedDataset);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    bars.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterGroup = bars.enter().append('rect').classed('bar', true);

    // join the new data points with existing
    bars = bars.merge(enterGroup);

    bars
      .attr('x', (d, i) => {
        const label = onGetLabel ? onGetLabel(d, i) : '';
        return xd3BarScale(label) ?? 0;
      })
      .attr('y', (d, i) => {
        const value = onGetValue ? onGetValue(d, i) : 0;
        return yScale(value);
      })
      .attr('width', xd3BarScale.bandwidth())
      .attr('height', (d, i) => {
        const value = onGetValue ? onGetValue(d, i) : 0;
        return chartHeight - yScale(value);
      })
      .attr('fill', (d) => colourScale(d.key))
      .style('opacity', alpha);
  }
}

export { CBar };
