/* eslint-disable @typescript-eslint/no-explicit-any */
import * as d3 from 'd3';
import { tContainerAttrs, tScaling } from '../sharedTypes';
import { PlotBase } from './PlotBase';

class CScatter extends PlotBase {
  draw(container: tContainerAttrs, { xScale, yScale }: tScaling) {
    const { attrs } = this;
    const { labels, data, onGetValue, colours, onSetPlotGroupAttrs } = attrs;

    const { svg } = container;

    if (!svg) {
      return;
    }

    const chartGroup = svg.select(`.${attrs.plotID}`);

    // const colourScale = d3
    //   .scaleOrdinal<string, string>()
    //   .domain(labels)
    //   .range(['blue']);

    // select all rect in svg.chart-group with the class bar
    let plotGroups = chartGroup
      .selectAll<SVGGElement, number>('g.plot-groups')
      .data(data);

    // Exit - remove data points if current data.length < data.length last time this ftn was called
    plotGroups.exit().style('opacity', 0).remove();

    // Enter - add the shapes to this data point
    const enterPlotGroups = plotGroups
      .enter()
      .append('g')
      .classed('plot-groups', true);

    // join the new data points with existing
    plotGroups = plotGroups.merge(enterPlotGroups);

    plotGroups.style('fill', (_d, i) => colours[i] ?? 'blue');

    if (onSetPlotGroupAttrs) {
      onSetPlotGroupAttrs(plotGroups);
    }

    let circleGroups = plotGroups
      .selectAll<SVGCircleElement, number>('circle')
      .data((d: unknown) => d as any);

    circleGroups.exit().style('opacity', 0).remove();

    const circleGroupsEnter = circleGroups.enter().append('circle');

    circleGroups = circleGroups.merge(circleGroupsEnter);

    circleGroups
      .attr('cx', (_d: unknown, idx: number): number => {
        const result = xScale([idx] as any);
        return result || 0;
      })
      .attr('cy', (d, ith) => {
        if (onGetValue) {
          return yScale(onGetValue(d, ith));
        }
        return 0;
      })
      .attr('r', 1.5);
    // .style('fill', (d: unknown) => colours(d));
  }
}

export { CScatter };
