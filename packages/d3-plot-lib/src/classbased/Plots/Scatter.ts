/* eslint-disable @typescript-eslint/no-explicit-any */
import { tContainerAttrs, tScaling } from '../sharedTypes';
import { PlotBase } from './PlotBase';

class CScatter extends PlotBase {
  draw(container: tContainerAttrs, { xScale, yScale }: tScaling) {
    const { attrs } = this;
    const { ys, onGetX, onGetY, colours, onSetPlotGroupAttrs } = attrs;

    const { svg } = container;

    if (!svg) {
      return;
    }

    const chartGroup = svg.select(`.${attrs.plotID}`);

    // const colourScale = d3
    //   .scaleOrdinal<string, string>()
    //   .domain(labels)
    //   .range(['blue']);

    let plotGroups = chartGroup
      .selectAll<SVGGElement, number>('g.plot-groups')
      .data(ys);

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
      onSetPlotGroupAttrs(plotGroups as any);
    }

    let circleGroups = plotGroups
      .selectAll<SVGCircleElement, number>('circle')
      .data((d) => d);

    circleGroups.exit().style('opacity', 0).remove();

    const circleGroupsEnter = circleGroups.enter().append('circle');

    circleGroups = circleGroups.merge(circleGroupsEnter);

    circleGroups
      .attr('cx', (d: unknown, idx: number): number => {
        const value = onGetX ? onGetX(d, idx) : idx;
        return xScale(value) ?? 0;
      })
      .attr('cy', (d, ith) => {
        const value = onGetY ? onGetY(d, ith) : d;
        return yScale(value) ?? 0;
      })
      .attr('r', 1.5);
    // .style('fill', (d: unknown) => colours(d));
  }
}

export { CScatter };
